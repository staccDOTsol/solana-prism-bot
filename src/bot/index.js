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

let mod = 20
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
		let prism2 = prisms2[tokenB.address]
		//let prism2 = prisms2[tokenB]
		// find tokens full Object
		//let tokenB = tokenA //tokens[Math.floor(Math.random() * tokens.length)]

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
		const route = routes[0]// await routes.find((r) => r.providers.length  <= 15);
		//const routes2 = prism2.getRoutes( route.amountOut)
		const routes2 = prism2.getRoutes(route.amountOut)
		const route2 = routes2[0]// await routes.find((r) => r.providers.length  <= 15);

		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.length + routes2.length;
			let ammIds = [ ]
			let ammIdspks = []
			try {
			ammIds =  JSON.parse(fs.readFileSync('./ammIds.json').toString())
			
			ammIdspks = JSON.parse(fs.readFileSync('./ammIdspks.json').toString())
			} catch (err){

			}
			try {
					ammIds.push(tokenA.address)
					ammIds.push(tokenB.address)
					ammIdspks.push(tokenA.address)
					ammIdspks.push(tokenB.address)
		for (var file of [...routes,...routes2]){
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

		let simulatedProfit = calculateProfit(amountToTrade, route2.amountOut);

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
					expectedOutAmount: toDecimal(route2.amountOut, outputToken.decimals),
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
				
				let result = await swap(prism, prism, route, route2, tokenA.decimals, tokenB.decimals, market);
				if (result){
					cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++
					mod = mod * 1000
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
			mod = mod / 1.1
			
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
			let configs2 = 
				{
				  "name": "main",
				  "address": "F8dCQofhBuspm1sVsrfr8NReJvGn1JfiR9xARnUBQgo1",
				  "authorityAddress": "HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV",
				  "reserves": [
					{
					  "asset": "SOL",
					  mint: "So11111111111111111111111111111111111111112",
					  dec: 9,
					  assetPriceUSD: 30,
					  "address": "fuSA8HSSku7BwRsVFWotGcVpwH3QrGtnhqWRS4orhXG",
					  "collateralMintAddress": "44PeAshzRSmhzQ3Da9z22YXYRN18PfsTHVXZpcQ7p7TH",
					  "jareMint": "7yN93TFSCZqseppJyxXjnAnps7wH1wRtvgemFXksc25t",
					  "collateralSupplyAddress": "A8aUS1MBosuSLXwfP16iYL3VgJvPKhLGwGzvpuieRTvJ",
					  "liquidityAddress": "CBH6VFEhBatZ265jrfKDMey5NQgMZhedk7piu5BCDYfW",
					  "liquidityFeeReceiverAddress": "wwQZH2vvWqiqwudoQYQ5RydW2CkgD5FApgD6f92KqHb",
					  "userSupplyCap": 4,
					  "reserveSupplyCap": 40000
					},
					{
					  "asset": "USDC",
					  dec: 6,
					  assetPriceUSD: 1,
					  "mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
					  "address": "5guv5xt2we2FpPXkSPN8oaz6C876NjiV62Np5RxghDnb",
					  "collateralMintAddress": "CnwtgyFcTyuQMKDSU1KCXVS4jPksjJUVQaMkgZ2WU3ny",
					  "jareMint": "2DvSLHu3HDTDEdWnYETdTtuywTvenmVQpsvn5ybEbKpA",
					  "collateralSupplyAddress": "HxL7nx79BLBwjGKAmnSYPhxdbPCpzHqj7UVb1ni3iUFC",
					  "liquidityAddress": "Ho9gUv6Y5KKZzxat5pbnf2skppcVpniss6zrabhWwi1n",
					  "liquidityFeeReceiverAddress": "8c5tAQAobrRyHgtLZJyaprLjv4yyL5YPEqS2S4wqD9UR",
					  "userSupplyCap": 10000,
					  "reserveSupplyCap": 1000000
					},
					{
					  "asset": "COPE",
					  dec: 6,
					  assetPriceUSD: 0.05,
					  mint:"8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh",
					  "address": "CoQgPXDKkBo84K14uFbGqkNmXHjKLYXt6d4BvLY6LWpu",
					  "collateralMintAddress": "EHSug7WuXkoPDaeF2Cog4mcZ6SKZ5iJ1rkXFoczrXWqL",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "4RjkXaYqrKX8pd5t9RvPt4UmhyzuXjKT25ysXWQD2V56",
					  "liquidityAddress": "6q7eZ2XBkgrwRpWnaVct6aRTKV9zmiGgXYuCQs4BQsjh",
					  "liquidityFeeReceiverAddress": "47AV9KQgT8MxFrBnQC5uGK56NLQRMZPgze4G4i4sgGzJ",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "DAI",
					  dec: 8,
					  assetPriceUSD: 1,
					  mint:"EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o",
					  "address": "GkwFTuAEqDG1seWeSy1htLpkaSjMdqhuMSEvwWjDB4xX",
					  "collateralMintAddress": "J4vUxcsHkoWudqWhooDxzx9aoHrXtZ73qj9DtQSqqwwS",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "4dKHbXHDc13XpstSPo9chs3vvXQxjbtYb97ueppgA4JG",
					  "liquidityAddress": "5rpiCSbB2eNb9v2JZj8dxKSgE3gQWguB3uigtG6W8cCq",
					  "liquidityFeeReceiverAddress": "5rpiCSbB2eNb9v2JZj8dxKSgE3gQWguB3uigtG6W8cCq",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "USDH",
					  dec: 6,
					  assetPriceUSD: 1,
					  mint:"USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
					  "address": "78w9qRtdCQ6zWNUGnZxk6p36sdzuutHCtMQCJM4bKyAW",
					  "collateralMintAddress": "EESxsxPQzzPLw33FcKq5saQAt1y65FDSsKfJA6R4JDyk",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "4CTXun1cgPYmb2WigPZB5YBtFGzCnaC4L3CSqqmYD8L8",
					  "liquidityAddress": "5D3wK5tHv6j93ptawdYuGYhpxgjtagbLnhBWqrV57DRw",
					  "liquidityFeeReceiverAddress": "EbEa9dr2seUxpgYuCCmWdopnkhboMHJ1ubPEen6H23ez",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "PAI",
					  dec: 6,
					  assetPriceUSD: 1,
					  mint:"Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS",
					  "address": "DHP6TaqV9kafmg3ooqbvWPwzeMvtwphTzFShnjBNzRsp",
					  "collateralMintAddress": "EUiemqKoJEUxTr4wtBZdqkBCWwk8qutKpprUDVSDFbbr",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "6uWfWV8kZUPDjLVAxDoAomVXrasykgwgRXZRJhWZBdBH",
					  "liquidityAddress": "6X3mfHU9FiimfF1VinUS2g1mX9LBvgywi5fRtLqnno85",
					  "liquidityFeeReceiverAddress": "6X3mfHU9FiimfF1VinUS2g1mX9LBvgywi5fRtLqnno85",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "USDT",
					  dec: 6,
					  assetPriceUSD: 1,
					  mint:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
					  "address": "5EmzXiKYz3skJS3PSzj9BScdbxQ8huH3CfV6f68LUZGk",
					  "collateralMintAddress": "4kKNXxKRx2EdDnRU4beS9JBnuD5cMTL1BQ8WK2iZVoeu",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "9UfnnuvLd13yw7vvCR5r3EW7Pbgkam1eR87fDkfSQ383",
					  "liquidityAddress": "8PckZa5Yz2tR4zK7vyzqBC6pehHzfUipdGPP9ggwQasP",
					  "liquidityFeeReceiverAddress": "8PckZa5Yz2tR4zK7vyzqBC6pehHzfUipdGPP9ggwQasP",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "UXD",
					  dec: 6,
					  assetPriceUSD: 1,
					  mint:"7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
					  "address": "9kB2wr3bKEb5ahMKZNLXPPod5zw3TKYj6BxMPC7SPWpR",
					  "collateralMintAddress": "DhjKo3rteKS8W2BxbdwiofRZpaSQynTt7k5zu4jYv8Fo",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "2Ent5MByfvbGCKpksQwvXG1ugwJripceDMTAuUWkqmhp",
					  "liquidityAddress": "6v4MfzUcNE7U4jWdZigXAyAMpf8kjfLPhpzRAQJHEkFN",
					  "liquidityFeeReceiverAddress": "6v4MfzUcNE7U4jWdZigXAyAMpf8kjfLPhpzRAQJHEkFN",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "xUSD",
					  dec: 6,
					  assetPriceUSD: 1,
					  mint:"83LGLCm7QKpYZbX8q4W2kYWbtt8NJBwbVwEepzkVnJ9y",
					  "address": "BaTPg1VNoxK86wDZCWfMMdohQH1tdMx326sS2eswZNhb",
					  "collateralMintAddress": "5UtPVrTGZN2qc5vLeMPXthVxQuEjqkvW15NHSqtPhPX5",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "GsChWtokr1uVAESEMozAhMWwG2oMuv1HrfXSS1kTy8YN",
					  "liquidityAddress": "53goDCNsdDcKADfy2EQRfiY3C9jewoMz5te3tw2TgfXV",
					  "liquidityFeeReceiverAddress": "53goDCNsdDcKADfy2EQRfiY3C9jewoMz5te3tw2TgfXV",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					},
					{
					  "asset": "USH",
					  dec: 9,
					  assetPriceUSD: 1,
					  mint:"9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6",
					  "address": "5MRaCd2mVqgT67sTBzRTUZChgCESot51zdApWCpAeb7h",
					  "collateralMintAddress": "HYdzX8u6GUE2JrnBxpLocquPRmkZbr5UDAmax2orU65c",
					  "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
					  "collateralSupplyAddress": "2FFQZiYsqDxHHEZJxu2b7tQa3mgrnftUVaPj97RFpgeq",
					  "liquidityAddress": "Ck92WGWDJWWSUZRMxEpvMinF3UG7FfKDDroeSAYkeFfi",
					  "liquidityFeeReceiverAddress": "Ck92WGWDJWWSUZRMxEpvMinF3UG7FfKDDroeSAYkeFfi",
					  "userSupplyCap": 2500,
					  "reserveSupplyCap": 300000
					}
				  ]
				}
			  
			let tokenBs = []
			for (var res of configs2.reserves){
		tokenBs.push(res.mint)
		
		}
			let tb = tokenBs[Math.floor(Math.random()*tokenBs.length)]

			tokens = JSON.parse(fs.readFileSync("./solana.tokenlist.json").toString());
			tokenB = tokens.tokens.find((t) => t.address === tb);
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
		logExit(error);
		//process.exitCode = 1;
	}
};

run();

// handle exit
process.on("exit", handleExit);
