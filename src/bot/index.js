console.clear();
const fs = require('fs')
require("dotenv").config();
const { clearInterval } = require("timers");
const { PublicKey } = require("@solana/web3.js");

const {
	calculateProfit,
	toDecimal,
	toNumber,
	updateIterationsPerMin,
	checkRoutesResponse,
} = require("../utils");
const { handleExit, logExit } = require("./exit");
const cache = require("./cache");
const { setup, getInitialOutAmountWithSlippage } = require("./setup");
const { printToConsole } = require("./ui/");
const { swap, failedSwapHandler, successSwapHandler } = 	require("./swap");
process.on('SIGINT', signal => {
	console.log(`Process ${process.pid} has been interrupted`)
	//process.exit()
  
})

let mod = 255
  process.on('uncaughtException', err => {
	console.log(err)
	//process.exit()

  })
  process.on('unhandledRejection', (reason, promise) => {
	console.log(reason)
//process.exit()
  })
const pingpongStrategy = async (prism, tokenA, tokenB) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;

	try {
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);

		// Calculate amount that will be used for trade
		let amountToTrade =
			cache.config.tradeSize.strategy === "cumulative"
				? cache.currentBalance[cache.sideBuy ? "tokenA" : "tokenB"]
				: cache.initialBalance[cache.sideBuy ? "tokenA" : "tokenB"];
		
		let baseAmount = cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"];
		cache.sideBuy ? baseAmount = baseAmount / 10 ** tokenA.decimals : baseAmount = baseAmount / 10 ** tokenB.decimals
		cache.sideBuy ? amountToTrade = amountToTrade / 10 ** tokenA.decimals : amountToTrade = amountToTrade / 10 ** tokenB.decimals
		// default slippage
		const slippage =
			typeof cache.config.slippage === "number" ? cache.config.slippage : 1;

		// set input / output token
		const inputToken = cache.sideBuy ? tokenA : tokenB;
		const outputToken = cache.sideBuy ? tokenB : tokenA;

		// check current routes
		const performanceOfRouteCompStart = performance.now();

		baseAmount = mod //* baseAmount
		amountToTrade = mod //* amountToTrade
				const routes = prism.getRoutes(amountToTrade)

		checkRoutesResponse(routes);
		fs.writeFileSync('./usdctousdc.json', JSON.stringify(routes[0]))

		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.length;

		// update status as OK
		cache.queue[i] = 0;

		const performanceOfRouteComp =
			performance.now() - performanceOfRouteCompStart;

		await prism.loadRoutes(
			tokenA.address,
			tokenB.address
		)
		// choose first route
		const route = await routes.find((r) => r.providers.length  <= 50)
		
		// update slippage with "profit or kill" slippage
		if (cache.config.slippage === "profitOrKill") {
			route.amountWithFees =
				cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"];
		}

		// calculate profitability

		let simulatedProfit = calculateProfit(baseAmount, route.amountOut);

		// store max profit spotted
		if (
			simulatedProfit > cache.maxProfitSpotted[cache.sideBuy ? "buy" : "sell"]
		) {
			cache.maxProfitSpotted[cache.sideBuy ? "buy" : "sell"] = simulatedProfit;
		}

		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken,
			tokenA,
			tokenB,
			route,
			simulatedProfit,
		});

		// check profitability and execute tx
		let tx, performanceOfTx;
		if (
			!cache.swappingRightNow &&
			(/*cache.hotkeys.e ||
				cache.hotkeys.r || */  // buggy lol
				simulatedProfit >= cache.config.minPercProfit)
		) {
			// hotkeys
			if (cache.hotkeys.e) {
				console.log("[E] PRESSED - EXECUTION FORCED BY USER!");
				cache.hotkeys.e = false;
			}
			if (cache.hotkeys.r) {
				console.log("[R] PRESSED - REVERT BACK SWAP!");
				route.amountWithFees = 0;
			}

			if (cache.tradingEnabled || cache.hotkeys.r) {
				cache.swappingRightNow = true;
				// store trade to the history
				let tradeEntry = {
					date: date.toLocaleString(),
					buy: cache.sideBuy,
					inputToken: inputToken.symbol,
					outputToken: outputToken.symbol,
					inAmount: toDecimal(route.inAmount, inputToken.decimals),
					expectedOutAmount: toDecimal(route.amountOut, outputToken.decimals),
					expectedProfit: simulatedProfit,
				};

				await swap(prism, route, tokenA.decimals);

				// stop refreshing status
				clearInterval(printTxStatus);

			}
		}

			cache.swappingRightNow = false;
		
		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken,
			tokenA,
			tokenB,
			route,
			simulatedProfit,
		});
	} catch (error) {
		cache.queue[i] = 1;
		console.log(error);
	} finally {
		delete cache.queue[i];
	}
};

const arbitrageStrategy = async (prism, tokenA) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;
	try {
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);

		// Calculate amount that will be used for trade
		let amountToTrade =
			cache.config.tradeSize.strategy === "cumulative"
				? cache.currentBalance["tokenA"]
				: cache.initialBalance["tokenA"] ;
		let baseAmount = cache.lastBalance["tokenA"] ;
		
		// default slippage
		const slippage =
			typeof cache.config.slippage === "number" ? cache.config.slippage : 1;
		// set input / output token
		const inputToken = tokenA;
		const outputToken = tokenA;

		// check current routes
		const performanceOfRouteCompStart = performance.now();
		baseAmount = mod //* baseAmount
		amountToTrade = mod //* amountToTrade
		const routes = prism.getRoutes(amountToTrade)
let ammIds = [] 
let ammIdspks = []
		checkRoutesResponse(routes);
		/*
		for (var file of routes){
			try {

				for (var rd of Object.values(file.routeData)){
					try {
						// @ts-ignore
						for(var rd2 of Object.values(rd.routeData)){
							try {
												// @ts-ignore 
				
								if ((rd2.ammId) != undefined){
									// @ts-ignore
									let dothedamnthing = new PublicKey(rd2.ammId)
								// @ts-ignore 
								if (!ammIdspks.includes(dothedamnthing.toBase58())){
													// @ts-ignore 
				
									ammIdspks.push(dothedamnthing.toBase58())
									ammIds.push(dothedamnthing)
								}
								}
							} catch (err){
				
							}
						}
					}
					catch (err){
				
					}
				}

			
			fs.writeFileSync('./ammIdspks.json',JSON.stringify(ammIdspks))
			fs.writeFileSync('./ammIds.json',JSON.stringify(ammIds))
			}
			catch (err){
console.log(err)
			}
		}
		process.exit() */
		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.length;

		// update status as OK
		cache.queue[i] = 0;

		const performanceOfRouteComp =
			performance.now() - performanceOfRouteCompStart;

				// choose first route
		const route = routes[Math.floor(Math.random()*10)]//await routes.find((r) => r.providers.length  <= 50);
		// update slippage with "profit or kill" slippage
		if (cache.config.slippage === "profitOrKill") {
			route.amountWithFees = cache.lastBalance["tokenA"];
		}
		// calculate profitability

		let simulatedProfit = calculateProfit(baseAmount, route.amountOut);

		// store max profit spotted
		if (simulatedProfit > cache.maxProfitSpotted["buy"]) {
			cache.maxProfitSpotted["buy"] = simulatedProfit;
		}

		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken,
			tokenA,
			tokenB: tokenA,
			route,
			simulatedProfit,
		});

		// check profitability and execute tx
		let tx, performanceOfTx;
		if (
			!cache.swappingRightNow &&
			(/*cache.hotkeys.e ||
				cache.hotkeys.r || */  // buggy lol
				simulatedProfit >= cache.config.minPercProfit)
		) {
			// hotkeys
			if (cache.hotkeys.e) {
				console.log("[E] PRESSED - EXECUTION FORCED BY USER!");
				cache.hotkeys.e = false;
			}
			if (cache.hotkeys.r) {
				console.log("[R] PRESSED - REVERT BACK SWAP!");
				route.amountWithFees = 0;
			}

			if (cache.tradingEnabled || cache.hotkeys.r) {
				cache.swappingRightNow = true;
				// store trade to the history
				let tradeEntry = {
					date: date.toLocaleString(),
					buy: cache.sideBuy,
					inputToken: inputToken.symbol,
					outputToken: outputToken.symbol,
					inAmount: toDecimal(route.inAmount, inputToken.decimals),
					expectedOutAmount: toDecimal(route.amountOut, outputToken.decimals),
					expectedProfit: simulatedProfit,
				};

				// start refreshing status
				const printTxStatus = setInterval(() => {
					if (cache.swappingRightNow) {
						printToConsole({
							date,
							i,
							performanceOfRouteComp,
							inputToken,
							outputToken,
							tokenA,
							tokenB: tokenA,
							route,
							simulatedProfit,
						});
					}
				}, 500);
				
				let result = await swap(prism, route, tokenA.decimals);
				if (result){
					cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++
					mod = mod * 10
				}
				else {
					
				}
				cache.tradingEnabled = true 
				cache.swappingRightNow = false
				// stop refreshing status
				clearInterval(printTxStatus);
			}
		}

			cache.swappingRightNow = false;
			mod = mod / 3
		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken,
			tokenA,
			tokenB: tokenA,
			route,
			simulatedProfit,
		});
	} catch (error) {
		cache.queue[i] = 1;
		throw error;
	} finally {
		delete cache.queue[i];
	}
};

const watcher = async (prism, tokenA, tokenB) => {
	if (
		!cache.swappingRightNow &&
		Object.keys(cache.queue).length < cache.queueThrottle
	) {
		if (cache.config.tradingStrategy === "pingpong") {
			await pingpongStrategy(prism, tokenA, tokenB);
		}
		if (cache.config.tradingStrategy === "arbitrage") {
			await arbitrageStrategy(prism, tokenA, tokenB);
		}
	}
};

const run = async () => {
	try {
		// set everything up
		const { prism, tokenA, tokenB } = await setup();

		if (cache.config.tradingStrategy === "pingpong") {
			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				tokenA.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;

			// set initial & last balance for tokenB
			cache.initialBalance.tokenB = await getInitialOutAmountWithSlippage(
				prism,
				tokenA,
				tokenB,
				cache.initialBalance.tokenA
			);
			cache.lastBalance.tokenB = cache.initialBalance.tokenB;
		} else if (cache.config.tradingStrategy === "arbitrage") {
			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				tokenA.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;
		}

		global.botInterval = setInterval(
			() => watcher(prism, tokenA, tokenB),
			cache.config.minInterval
		);
	} catch (error) {
		logExit(error);
		process.exitCode = 1;
	}
};

run();

// handle exit
process.on("exit", handleExit);
