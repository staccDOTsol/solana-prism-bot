const  axios  = require("axios");
const promiseRetry = require("promise-retry");

const { logExit, handleExit } = require("../bot/exit");
const { storeItInTempAsJSON } = require("../utils");
const cache = require("../bot/cache");

const getSwapResultFromSolscanParser = async (txid) => {
	try {
		// disable trading till swap result is ready
		cache.tradingEnabled = false;

		cache.fetchingResultsFromSolscan = true;
		cache.fetchingResultsFromSolscanStart = performance.now();

		const fetcher = async (retry) => {
			const response = await axios.get(`https://api.solscan.io/transaction`, {
				params: {
					tx: txid,
				},
			});

			if (process.env.DEBUG)
				storeItInTempAsJSON(`solscan_${txid}`, response.data);

			if (response.status === 200) {
				if (response?.data?.mainActions) {
					return response.data;
				} else {
					retry(new Error("Transaction was not confirmed"));
				}
			}
		};

		const data = await promiseRetry(fetcher, {
			retries: 40,
			minTimeout: 2000,
			maxTimeout: 5000,
			randomize: true,
		});

		const ownerAddress = data?.signer[0];

		if (!ownerAddress) throw new Error("Owner address not found");

		const tokenAddress = cache?.config?.tokenA.address;

		const mainActions = data.mainActions;

		let [inputAmount, outputAmount] = [-1, -1];
		mainActions.filter((action) => {
			const events = action?.data?.event;
			if (events) {
				const inputEvent = events.find(
					(event) =>
						event?.sourceOwner === ownerAddress &&
						event?.tokenAddress === tokenAddress
				);
				const outputEvent = events.find(
					(event) =>
						event?.destinationOwner === ownerAddress &&
						event?.tokenAddress === tokenAddress
				);

				if (inputEvent) inputAmount = parseInt(inputEvent?.amount);

				if (outputEvent) outputAmount = parseInt(outputEvent?.amount);
			}
		});

		return [inputAmount, outputAmount];
	} catch (error) {
		logExit(1, error);
		handleExit();
	} finally {
		cache.fetchingResultsFromSolscan = false;
		cache.tradingEnabled = true;
	}
};

module.exports = {
	getSwapResultFromSolscanParser,
};
