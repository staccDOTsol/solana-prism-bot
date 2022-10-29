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
  } = require( "../solend-sdk/dist" );
  const { Token } = require('@solana/spl-token');

const payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
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
const swap = async (prism, route, decimals) => {
		let goaccs = []
		const performanceOfTxStart = performance.now();

		const connection = new Connection(cache.config.rpc[Math.floor(Math.random() * cache.config.rpc.length)], {commitment: 'singleGossip'});

		const market = await SolendMarket.initialize(
			connection,
		  
			"production", // optional environment argument'
			//"9QxPT2xEHn56kREPF83uAhrMXo1UtPL1hS2FfXS9sdpo"
		   // market.address
		  )
		  var reserve  = market.reserves.find((res) => 
			 res.config.asset === route.from);
			 const params = {
				units: 301517 + 301517 + 301517 + 101517 + 101517,
				additionalFee: 1,
			  };
			 const ix =
			 ComputeBudgetProgram.requestUnits(params);
			 
			 let arg2 = (
				await connection.getTokenAccountsByOwner(
				  payer.publicKey,
				  { mint: new PublicKey(reserve.config.mint) }
				)
			  ).value[0]
			  let tokenAccount = arg2.pubkey
		   let instructions = [
			 ix,
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
		

		const blockhash = await connection
				  .getLatestBlockhash()
				  .then((res) => res.blockhash); 
				  await Promise.all(
					[swapTransaction.preTransaction, swapTransaction.mainTransaction, swapTransaction.postTransaction]
					  .filter(Boolean)
					  .map(async (serializedTransaction) => {
						instructions.push(...serializedTransaction.instructions)
					  }))
					  instructions.push(
						flashRepayReserveLiquidityInstruction(
						  
							Math.ceil(route.amountIn * 10 ** decimals),
							1,
						  tokenAccount,
						  new PublicKey(
							reserve.config.liquidityAddress
						  ),
						  new PublicKey(
							reserve.config.liquidityAddress
						  ),
						  tokenAccount,
						  new PublicKey(reserve.config.address),
						  new PublicKey("F8dCQofhBuspm1sVsrfr8NReJvGn1JfiR9xARnUBQgo1"),
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
						Token.createTransferInstruction(new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
						  tokenAccount,
						  tokenAccount,
						  payer.publicKey,[],
						  Math.floor(myshit * 1.0000)
						)
					  ); 
					
			
					var blockhash2 = await connection
					.getLatestBlockhash()
					.then((res) => res.blockhash);

			let                              messageV0 = new TransactionMessage({
					payerKey: payer.publicKey,
					recentBlockhash: blockhash2,
					instructions,
				  }).compileToV0Message();
				  let w = 0
				  let winner 
				  let index = reserve.config.mint+","+reserve.config.mint
				  let r = route
				  for (var ehh of Object.values(r.routeData)){
					try {
					for (var ehh2 of Object.values(ehh.routeData)){
					try {
						
							  index+=','+(ehh2.ammId.toBase58())
						  }
						  catch (err){
							try
							{
								if (Object.keys(ehh2).includes('ammId')){
							let t = new PublicKey(ehh2.ammId)
							  index+=','+(ehh2.ammId)
								}
							} 
							catch (err){
								console.log(ehh2)
								console.log(err)
							}
							}
						
				} }
				catch (err){
					console.log(ehh)
					console.log(err)
				}
			}
				  let argh = JSON.parse(fs.readFileSync('./answers2.json').toString())
				  console.log(index)
				  let winner2 
				  let blargs = []

				  let winner3 
				  for (var bca of messageV0.staticAccountKeys){
				  let c =  0
				 let mematey = -1
				 
				  for (var arg of Object.keys(argh)){
					mematey++
					if (arg.split(',')[0] == reserve.config.mint &&  arg.split(',')[1] == reserve.config.mint){
					for (var blarg of index.split(',')){

					  if (arg.split(',').includes(blarg) && !blargs.includes(blarg)){
						for (var hmph of Object.values(argh)[mematey]){
							console.log(hmph)
						  let test = (await connection.getAddressLookupTable(new PublicKey(hmph))).value
if (test.state.addresses.includes(bca)){
	if (!goaccs.includes(test)){
	goaccs.push(test)
	}}
}
						}
					}
				}
			}
				}
		const  messageV00 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: blockhash,
			instructions,
		}).compileToV0Message(goaccs);
		  const transaction = new VersionedTransaction(
			messageV00
		  );

		transaction.sign([payer])
		const result = await  sendAndConfirmTransaction(connection, transaction)
		if (process.env.DEBUG) storeItInTempAsJSON("result", result);

		const performanceOfTx = performance.now() - performanceOfTxStart;

		return [result, performanceOfTx];
		  
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
