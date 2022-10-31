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
let MINT 	
	let reserve	
const {
	
	SolendMarket,
	
  } = require( "../solend-sdk/dist/index" );
const setup = async () => {
	let spinner, tokens, tokenA, tokenB, wallet;
	tokens = JSON.parse(fs.readFileSync("./solana.tokenlist.json").toString());
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
tokenBs = ["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]
console.log(tokenBs)
	let prisms = {}
	let prisms2 = {}
	try {
		// listen for hotkeys
		//listenHotkeys();
		//await intro();

		// load config file and store it in cache
		cache.config = loadConfigFile({ showSpinner: true });

		const connection = new Connection(cache.config.rpc[Math.floor(Math.random()*cache.config.rpc.length)]);

		spinner = ora({
			text: "Loading tokens...",
			discardStdin: false,
			color: "magenta",
		}).start();

		let good = false
		if ( true ){
		// read tokens.json file
		try {
			// find tokens full Object
			//tokenB = tokens[Math.floor(Math.random() * tokens.length)]
			//tokenB = tokenA
			let tbsa = []
		
			var markets = [
				await SolendMarket.initialize(
				  connection,
			  
				  "production" // optional environment argument
				)]
let configs = JSON.parse(fs.readFileSync('./configs.json').toString())
  for (var amarket of configs) {
	if (false){//!amarket.hidden && !amarket.isPermissionless) {
	  try {
		let market = await SolendMarket.initialize(
		  connection,
  
		  "production", // optional environment argument'
		  amarket.address
		);
  
		markets.push(market);
		console.log(markets.length);
	  } catch (err) {}
	}
  }
	
for (var market of markets){
	 reserve = market.reserves[Math.floor(Math.random() * market.reserves.length)]
	 reserve = reserve.config
  MINT = reserve.mint;
  if (reserve.asset == 'PAI'){
MINT = "Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"
  }
  tokenA ={address: MINT, decimals: reserve.dec, symbol: reserve.asset}
}
	
				console.log(tokenA)
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
						
			
			spinner.text = "Loading Prism SDK..." + is.length.toString();
			
			let ALT_RPC_LIST="https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn,https://solana-mainnet.g.alchemy.com/v2/QlAFXUZhGG-CoVy9r6vYAbsA7iiDnA9-,https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"
// @ts-ignore
let ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length)
// @ts-ignore
var connection2= new Connection(ALT_RPC_LIST?.split(',')[ran])
			prisms[tokenA.address]= await Prism.init({
				user: wallet,
				connection: connection2,
				slippage:99,
				host: {                                          // optional
					// host platform fee account publickey base58
					publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
					// fee bps e.g 5 => 0.05%
					fee: 138,
				  },
			})
			for (var tb of tokenBs){
console.log(tb)
				tokenB = tokens.tokens.find((t) => t.address === tb);
			console.log(1)
			await prisms[tokenA.address].loadRoutes(
				tokenA.address,
				tokenA.address
			)
/*			prisms2[tokenB.address]= await Prism.init({
				user: wallet,
				connection: connection2,
				slippage:99,
				host: {                                          // optional
					// host platform fee account publickey base58
					publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
					// fee bps e.g 5 => 0.05%
					fee: 138,
				  },
			})
			console.log(1)
			await prisms2[tokenB.address].loadRoutes(
				tokenB.address,
				tokenA.address
			)
*/
			console.log(2)
			}
			good = true 
			} catch (err){
				good = false
				console.log(err)
			}
		})
		spinner.text = "Loading routes for the first time...";
		
		cache.isSetupDone = true;
		spinner.succeed("Setup done!");
		return { prisms, prisms2,tokenA, tokenB, market, reserve };
	}
	} catch (error) {
		if (spinner)
			spinner.fail(
				chalk.bold.redBright(`Setting up failed!\n 	${spinner.text}`)
			);
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
