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
	let tokenBs = ["7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj","mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
"poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
"4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
"2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk","FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds",
"GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz",
"AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB"]
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
			tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
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
				tokenB = tokens.find((t) => t.address === tb);
			console.log(1)
			await prisms[tokenA.address].loadRoutes(
				tokenA.address,
				tokenB.address
			)
			prisms2[tokenB.address]= await Prism.init({
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
