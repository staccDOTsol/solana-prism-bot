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
	process.exit()
  
})

let mod = 0.1
  process.on('uncaughtException', err => {
	console.log(err)

  })
  process.on('unhandledRejection', (reason, promise) => {
	console.log(reason)
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
		await prisms[tokenA.address].loadRoutes(
			tokenA.address,
			tokenB.address
		)
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
		const route = routes[Math.floor(Math.random()*4)]//await routes.find((r) => r.providers.length  <= 15)
		
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
			outputToken: tokenA,
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
			outputToken: tokenA,
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

const arbitrageStrategy = async (prisms, prisms2, tokenA, tokenB, market, reserve) => {
	cache.iteration++;
	const date = new Date();

	const i = cache.iteration;
	cache.queue[i] = -1;
	try {
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);
		//console.log(tokenB)
		
		let prism = prisms[tokenA.address]
		let ran2 = Math.floor(Math.random() * Object.keys(prisms2).length)

		let prism2 = prisms2[Object.keys(prisms2)[ran2]]
		//let prism2 = prisms2[tokenB]
		// find tokens full Object
		//let tokenB = tokenA //tokens[Math.floor(Math.random() * tokens.length)]

		
		// default slippage
		const slippage =
			typeof cache.config.slippage === "number" ? cache.config.slippage : 1;
		// set input / output token
		const inputToken = tokenA;
		const outputToken = tokenB;

		// check current routes
		const performanceOfRouteCompStart = performance.now();
		baseAmount = mod //* baseAmount
		amountToTrade = mod //* amountToTrade
		amountToTrade = Math.floor(amountToTrade * 10 ** tokenA.decimals) / 10 ** tokenA.decimals
		baseAmount = Math.floor(baseAmount * 10 ** tokenA.decimals) / 10 ** tokenA.decimals
		const routes = prism.getRoutes(amountToTrade)
		
checkRoutesResponse(routes);


		// update status as OK
		cache.queue[i] = 0;

		const performanceOfRouteComp =
			performance.now() - performanceOfRouteCompStart;

				// choose first route
		const route =   routes[0]//await routes.find((r) => r.providers.length  <=1);
	//	const routes2 = prism2.getRoutes(route.amountOut * 1.001)
//		const route2 =   routes2[0]
		//const routes2 = prism2.getRoutes( route.amountOut)
//		const routes2 = prism2.getRoutes(route.amountOut)
	//	const route2 =  await routes2.find((r) => r.providers.length  <= 2);

		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.length//+ routes2.length;	
			try {
			} catch (err){

			}
			try {
			let ammIds = [ ]
			let ammIdspks = []
try {
			ammIds =  JSON.parse(fs.readFileSync('./ammIds.json').toString())
			
			ammIdspks = JSON.parse(fs.readFileSync('./ammIdspks.json').toString())
} catch (err){
}
		for (var file of [...routes]){//},...routes2]){//{//}),...routes2]){
			try {

				for (var rd of Object.values(file.routeData)){
					try {
						// @ts-ignore
						for(var rd2 of Object.values(rd.routeData)){
							try {
								try {
												// @ts-ignore 
				
												
								if ((rd2.orcaPool) != undefined){
									let dothedamnthing = rd2.oracaPool.orcaTokenSwapId
									if (!ammIdspks.includes(dothedamnthing.toBase58())){
										// @ts-ignore 
	
						ammIdspks.push(dothedamnthing.toBase58())
						ammIds.push(dothedamnthing)
					}
				}
								} catch (err){}
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
								if ((rd2.swapAccount) != undefined){
									// @ts-ignore
									let dothedamnthing = new PublicKey(rd2.swapAccount)
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
	}  catch (Err){}
		//checkRoutesResponse(routes2);
		//const route2 = routes2[Math.floor(Math.random()*4)]//await routes2.find((r) => r.providers.length  <= 15);
		// update slippage with "profit or kill" slippage
		
		// calculate profitability

		let simulatedProfit = calculateProfit(route.amountIn, route.amountOut);


		// store max profit spotted
		if (simulatedProfit > cache.maxProfitSpotted["buy"]) {
			cache.maxProfitSpotted["buy"] = simulatedProfit;
		}

		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken: tokenA,
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
							outputToken: tokenA,
							tokenA,
							tokenB,
							route,
							simulatedProfit,
						});
					}
				}, 500);
				
				let result = await swap(prism, prism2, route, route, tokenA.decimals, tokenB.decimals, market);
				if (result){
					cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++
					mod = mod * 20
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
			mod = mod / 1.4
			
		printToConsole({
			date,
			i,
			performanceOfRouteComp,
			inputToken,
			outputToken: tokenA,
			tokenA,
			tokenB,
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

const watcher = async (prisms, prisms2, tokenA, tokenB, market, reserve) => {
	if (
		
		Object.keys(cache.queue).length < cache.queueThrottle
	) {
		if (cache.config.tradingStrategy === "pingpong") {
			await pingpongStrategy(prisms, tokenA, tokenB);
		}
		if (cache.config.tradingStrategy === "arbitrage") {
			
			await arbitrageStrategy(prisms, prisms2, tokenA, tokenB, market, reserve);
		}
	}
};

const run = async () => {
	try {
		// set everything up
		const { prisms, prisms2, tokenA, tokenB, market, reserve } = await setup();

			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				tokenA.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;
		

		global.botInterval = setInterval(
			() => watcher(prisms, prisms2, tokenA, tokenB, market, reserve),
			cache.config.minInterval
		);
	} catch (error) {
		console.log(error)
		//logExit(error);
		//process.exitCode = 1;
	}
};

run();

// handle exit
process.on("exit", handleExit);
