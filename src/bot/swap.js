const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const fetch = require('node-fetch')
const fs = require('fs')
const { getSwapResultFromSolscanParser } = require("../services/solscan");
const { sendAndConfirmTransaction, Connection, Transaction, VersionedTransaction,
	 TransactionMessage, Keypair, ComputeBudgetProgram, PublicKey, AddressLookupTableProgram } = require("@solana/web3.js");
const bs58 = require("bs58");
const axios = require('axios')
/*
const {
	
	flashBorrowReserveLiquidityInstruction,


} = require( "../solend-sdk/dist/instructions/flashBorrowReserveLiquidity" );
const {
	
	flashRepayReserveLiquidityInstruction,


} = require( "../solend-sdk/dist/instructions/flashRepayReserveLiquidity" );

const SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey("E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa")
*/
const { flashRepayReserveLiquidityInstruction, flashBorrowReserveLiquidityInstruction,SOLEND_PRODUCTION_PROGRAM_ID } = require('@solendprotocol/solend-sdk')
const { Token, createTransferInstruction } = require('@solana/spl-token');
const { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } = require("@project-serum/anchor/dist/cjs/utils/token");

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
const swap = async (prism, prism2, route, route2, decimals, tokenB, market) => {
	try {
		var reserve  = market.reserves.find((res) => 
		res.config.liquidityToken.symbol === route.from);
				let goaccs = []
		const performanceOfTxStart = performance.now();

		const connection = new Connection(cache.config.rpc[Math.floor(Math.random() * cache.config.rpc.length)]);


			 const params = {
				units: 301517 + 301517 + 301517 + 101517 + 101517,
				additionalFee: 1,
			  };
			 const ix =
			 ComputeBudgetProgram.requestUnits(params);
			 console.log(reserve.config.liquidityToken.mint)
			  try {
				let la = new PublicKey(reserve.config.liquidityToken.mint)
			  }
			  catch (err){
				reserve.config.liquidityToken.mint = "Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"
			  }
			let ALT_RPC_LIST="https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn,https://solana-mainnet.g.alchemy.com/v2/QlAFXUZhGG-CoVy9r6vYAbsA7iiDnA9-,https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"
			// @ts-ignore
			let ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length)
			
			// @ts-ignore
			var connection2= new Connection(ALT_RPC_LIST.split(',')[ran])
			 let arg2 = (
				await connection2.getTokenAccountsByOwner(
				  payer.publicKey,
				  { mint: new PublicKey(reserve.config.liquidityToken.mint) }
				)
			  ).value[0]
			  let tokenAccount 

			  let instructions = [
				flashBorrowReserveLiquidityInstruction(
				  Math.ceil(route.amountIn * 10 ** decimals),
				  new PublicKey(reserve.config.liquidityAddress),
				  tokenAccount,
				  new PublicKey(reserve.config.address),
				  new PublicKey(market.config.address),
				  SOLEND_PRODUCTION_PROGRAM_ID,
				  payer.publicKey
				),
			  ];		
			  try {
tokenAccount = arg2.pubkey
			  }
			   catch (err){
				let ata = Keypair.generate()
let abc = new Transaction()
	 // Get the derived address of the destination wallet which will hold the custom token
	 const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
		ASSOCIATED_PROGRAM_ID,
		TOKEN_PROGRAM_ID,
		new PublicKey(tokenB),
		payer.publicKey
	  );
	tokenAccount = associatedDestinationTokenAddr
	  const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
			
	abc.add(
		Token.createAssociatedTokenAccountInstruction(
			ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID,
			new PublicKey(tokenB) ,
			
			associatedDestinationTokenAddr, // ata// mint
			payer.publicKey, // payer
			payer.publicKey, // owner
		  )
	  
		); 
		  const  messageV10 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: (await (
				await connection.getLatestBlockhash()
			  ).blockhash),
			instructions: abc.instructions,
		}).compileToV0Message();
		const abc2 = new VersionedTransaction(
					messageV10
				  );
		abc2.sign([payer])
				const result = await   sendAndConfirmTransaction(connection, abc2)
		console.log(111)

		console.log(Token.createAssociatedTokenAccountInstruction(
			ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID,
			new PublicKey(reserve.config.liquidityToken.mint) ,
			
			ata.publicKey, // ata// mint
			payer.publicKey, // payer
			payer.publicKey, // owne
		  ))
			   } /*
			  let arg3 = (
				await connection2.getTokenAccountsByOwner(
				  new PublicKey("EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg"),
				  { mint: new PublicKey(reserve.config.liquidityToken.mint) }
				)
			  ).value[0] */
			  let tokenAccountDestination /*
			  try {
				tokenAccountDestination  = arg3.pubkey
			  } catch (err){
				let ata = Keypair.generate()
let abc = new Transaction()
			
	instructions.push(
		Token.createAssociatedTokenAccountInstruction(
			payer.publicKey, // payer
			ata.publicKey, // ata
			new PublicKey("EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg"), // owner
			new PublicKey(reserve.config.liquidityToken.mint) // mint
		  )
	  
		); 
		console.log(222)
		console.log(Token.createAssociatedTokenAccountInstruction(
			payer.publicKey, // payer
			ata.publicKey, // ata
			new PublicKey("EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg"), // owner
			new PublicKey(reserve.config.liquidityToken.mint) // mint
		  ))
			  }	
		   let arg4 = (
			await connection2.getTokenAccountsByOwner(
			  payer.publicKey,
			  { mint: new PublicKey(tokenB) }
			)
		  ).value[0]
		  
		  try {
		  tokenAccountDestination = arg4.pubkey
		  } catch (err){
let ata = Keypair.generate()
let abc = new Transaction()
tokenAccountDestination = ata.publicKey
	instructions.push(
		Token.createAssociatedTokenAccountInstruction(
			ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID,
			new PublicKey(tokenB) ,
			
			ata.publicKey, // ata// mint
			payer.publicKey, // payer
			payer.publicKey, // owne
		  )
	  
		); 
		console.log(333)
		console.log(Token.createAssociatedTokenAccountInstruction(
			ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID,
			new PublicKey(tokenB) ,
			
			ata.publicKey, // ata// mint
			payer.publicKey, // payer
			payer.publicKey, // owne
		  ))
	}*/
		cache.performanceOfTxStart = performanceOfTxStart;

//		if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

		const swapTransaction = await prism.generateSwapTransactions(route); 
		
//const swapTransaction2 = await prism2.generateSwapTransactions(route2); 
		

		const blockhash = await connection
				  .getLatestBlockhash()
				  .then((res) => res.blockhash); 
				  await Promise.all(
					[swapTransaction.preTransaction, swapTransaction.mainTransaction, swapTransaction.postTransaction/*,
				  swapTransaction2.preTransaction, swapTransaction2.mainTransaction, swapTransaction2.postTransaction*/]
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
		try {
					  instructions.push(
						Token.createTransferInstruction(new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
						  tokenAccount,
						  tokenAccountDestination,
						  payer.publicKey,[],
						  Math.floor(myshit* 0.5)
						)
					  ); 
					  
		} catch (err){
			instructions.push(
				createTransferInstruction(
				  tokenAccount,
				  tokenAccountDestination,
				  payer.publicKey,
				  Math.floor(myshit* 0.5),[]
				)
			  ); 
		}
			
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
				  let argh = [] 
				  try {
					argh = JSON.parse(fs.readFileSync('./tluts.json').toString()) }
				  catch (err){ argh = JSON.parse(fs.readFileSync('./powerfulluts.json').toString()) }
				  
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
						  if (!goodluts.includes(lut) && test){
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
		
/*
		const  messageV12 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: blockhash,
			instructions: [instructions[1], instructions[instructions.length-1]],
		}).compileToV0Message();
*/
		ss = []
		aaa = 0
let ourluts = JSON.parse(fs.readFileSync('./luts.json').toString())
var lookupTableAccount, lookupTableAddress, lookupTableInst
var lookupTableAccounts = []
for (var ourlut of ourluts){

   lookupTableAccount = await connection
  .getAddressLookupTable(new PublicKey(ourlut))
  .then((res) => res.value);
  if (lookupTableAccount){
  lookupTableAccounts.push(lookupTableAccount)
  goaccs.push(lookupTableAccount)
  }
}
var tx = new Transaction()

if (ourluts.length > 0){
	let ourlut =new PublicKey( ourluts[Math.floor(Math.random() * ourluts.length)])
	let lookupTableAccount = await connection
	.getAddressLookupTable((ourlut))
	.then((res) => res.value);
	if(lookupTableAccount){
			if (lookupTableAccount.state.addresses.length > 200){
				var slot = await connection.getSlot()

				var [lookupTableInst, lookupTableAddress] =
				AddressLookupTableProgram.createLookupTable({
				  authority: payer.publicKey,
				  payer: payer.publicKey,
				  recentSlot: slot,
				});

ourluts.push(lookupTableAddress)
tx.add(lookupTableInst)

			}else {
				/*
		for (var bca of messageV12.staticAccountKeys){
		  aaa++
		  for (var lookupTableAccountaa of lookupTableAccounts){
			if (ss.length < 15){
		  ss.push(bca)  
			}

		
	}*/
		//}
	}
		console.log(ss.length)
		if (ss.length > 0){
		const extendInstruction = AddressLookupTableProgram.extendLookupTable({
			payer: payer.publicKey,
			authority: payer.publicKey,
			lookupTable: ourlut,
			addresses: ss
			
		});
		
tx.add(extendInstruction)
	}
} else {
	let tarr = []
	for (var alut of ourluts){
		if (ourlut!=alut){
			tarr.push(alut)

		}
	}
	fs.writeFileSync('./luts.json',JSON.stringify(tarr ))
	//goaccs=tarr
}
	}

if (ourluts.length == 0){
	var slot = await connection.getSlot()

var [lookupTableInst, lookupTableAddress] =
  AddressLookupTableProgram.createLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    recentSlot: slot,
  });
  console.log(lookupTableAddress.toBase58())

tx.add(lookupTableInst)

ourluts.push(lookupTableAddress)
}
		tx.recentBlockhash = await (
			await connection.getLatestBlockhash()
		  ).blockhash;
		  
fs.writeFileSync('./luts.json',JSON.stringify(ourluts ))
if (tx.instructions.length > 0){
	console.log(...tx.instructions)
//await connection2.sendTransaction [tx, [payer])
}		
console.log(goaccs)
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
