const fs = require("fs");
const chalk = require("chalk");
const ora = require("ora-classic");
const bs58 = require("bs58");
const { Prism } = require("@prism-hq/prism-ag");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");

const { logExit } = require("./exit");
const { loadConfigFile } = require("../utils");
const { intro, listenHotkeys } = require("./ui");
const cache = require("./cache");
const PromisePool = require("@supercharge/promise-pool").default;

const setup = async () => {
	let spinner, tokens, tokenA, tokenB, wallet;
	let tokenBs = []
	let prisms = {}
	let prisms2 = {}
	try {
		// listen for hotkeys
		//listenHotkeys();
		//await intro();

		// load config file and store it in cache
		cache.config = loadConfigFile({ showSpinner: true });

		spinner = ora({
			text: "Loading tokens...",
			discardStdin: false,
			color: "magenta",
		}).start();

		// read tokens.json file
		try {
			tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
			// find tokens full Object
			tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
			//tokenB = tokenA
			let tbsa = []
			cache.config.tokenBs ? tbsa = cache.config.tokenBs : tbsa = 
			["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]/*,
			"9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i", 
			"MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac","7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
			"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", 
		"JET6zMJWkCN9tpRT2v2jfAmm5VnQFDpUBCyaKojmGtz",
	"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU","LFNTYraetVioAPnGJht4yNg2aUZFXR776cMeN9VMjXp",
"E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp",
"C98A4nkJXhpVZNAZdHUA95RpTF3T4whtQubL3YobiUX9",
"9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6",
"PRSMNsEPqhGVCH1TtWiJqPjJyh2cKrLostPZTNy1o5x",
"DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
"METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m",
			"MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"]//todo:more */
			for (var addy of tbsa){
				tokenBs.push(tokens.find((t) => t.address === addy));
			}
			if (cache.config.tradingStrategy !== "arbitrage") 
				tokenB = tokens.find((t) => t.address === cache.config.tokenB.address);
		} catch (error) {
			spinner.text = chalk.black.bgRedBright(
				`\n	Loading tokens failed!\n	Please try to run the Wizard first using ${chalk.bold(
					"`yarn start`"
				)}\n`
			);
			throw error;
		}

		// check wallet private key
		try {
			spinner.text = "Checking wallet...";
			
				wallet = Keypair.fromSecretKey(
					new Uint8Array(
					  JSON.parse(
						process.env.PRIV_KEY
					  )
					)
				  );
		} catch (error) {
			spinner.text = chalk.black.bgRedBright(
				`\n	Wallet check failed! \n	Please make sure that ${chalk.bold(
					"SOLANA_WALLET_PRIVATE_KEY "
				)}\n	inside ${chalk.bold(".env")} file is correct \n`
			);
			throw error;
		}

		spinner.text = "Setting up connection ...";
		// connect to RPC
	let is = [] 
	for (var i = 0; i < 1; i++){
		is.push(i)
	}
	console.log(is)
			await PromisePool.withConcurrency(cache.config.rpc.length)
			.for(is)
			// @ts-ignore
			.handleError(async (err, asset) => {
			  console.error(`\nError uploading or whatever`, err.message);
			  console.log(err);
			})
			// @ts-ignore
			.process(async (i) => {		
				console.log(is)
					try {
			const connection = new Connection(cache.config.rpc[Math.floor(Math.random()*cache.config.rpc.length)]);

			spinner.text = "Loading Prism SDK..." + is.length.toString();
			let tok = tokenBs[Math.floor(Math.random()*tokenBs.length)]
			console.log(tok.address)
			
			prisms[tok.address]= await Prism.init({
				user: wallet,
				connection: new Connection("https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"),
				slippage:99,
				host: {                                          // optional
					// host platform fee account publickey base58
					publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
					// fee bps e.g 5 => 0.05%
					fee: 138,
				  },
			})
			console.log(1)
			await prisms[tok.address].loadRoutes(
				tokenA.address,
				tok.address
			)
			console.log(2)
			prisms2[tok.address]= await Prism.init({
				user: wallet,
				connection: new Connection("https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"),
				slippage:99,
				host: {                                          // optional
					// host platform fee account publickey base58
					publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
					// fee bps e.g 5 => 0.05%
					fee: 138,
				  },
			})
			console.log(3)
			await prisms2[tok.address].loadRoutes(
				tok.address,
				tokenA.address
			)
			} catch (err){
				console.log(err)
			}
		})
		spinner.text = "Loading routes for the first time...";

		
		cache.isSetupDone = true;
		spinner.succeed("Setup done!");

		return { prisms, prisms2,tokenA, tokenB };
	} catch (error) {
		if (spinner)
			spinner.fail(
				chalk.bold.redBright(`Setting up failed!\n 	${spinner.text}`)
			);
		logExit(1, error);
		//process.exitCode = 1;
		//process.exit()
	}
};

const getInitialOutAmountWithSlippage = async (
	prism,
	inputToken,
	outputToken,
	amountToTrade
) => {
	let spinner;
	try {
		spinner = ora({
			text: "Computing routes...",
			discardStdin: false,
			color: "magenta",
		}).start();

		// compute routes for the first time
		
		const routes = prism.getRoutes(amountToTrade)

		if (routes?.length > 0) spinner.succeed("Routes computed!");
		else spinner.fail("No routes found. Something is wrong!");
		routes[0].outAmountWithSlippage = routes[0].amountWithFees
		return routes[0].outAmountWithSlippage;
	} catch (error) {
		if (spinner)
			spinner.fail(chalk.bold.redBright("Computing routes failed!\n"));
		logExit(1, error);
		//process.exitCode = 1;
	}
};

module.exports = {
	setup,
	getInitialOutAmountWithSlippage,
};
