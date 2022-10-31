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
	
	flashBorrowReserveLiquidityInstruction,
	flashRepayReserveLiquidityInstruction,

	SolendMarket,
	SOLEND_PRODUCTION_PROGRAM_ID
  } = require( "@solendprotocol/solend-sdk" );
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

		const connection = new Connection(cache.config.rpc[Math.floor(Math.random()*cache.config.rpc.length)]);

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
while (MINT == undefined && MINT != "SoLEao8wTzSfqhuou8rcYsVoLjthVmiXuEjzdNPMnCz"){
	 reserve = market.reserves[Math.floor(Math.random() * market.reserves.length + 1)]
	if (reserve.config.userBorrowCap != null){
  MINT = reserve.config.liquidityToken.mint;
	}
}
	}
	while (tokenB == undefined){
	
				tokenB = tokens.find((t) => t.address === MINT);
tokenA =  tokenB 
	}
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
			
			
			prisms[tokenA.address]= await Prism.init({
				user: wallet,
				connection,
				slippage:99,
				host: {                                          // optional
					// host platform fee account publickey base58
					publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
					// fee bps e.g 5 => 0.05%
					fee: 138,
				  },
			})
			console.log(1)
			await prisms[tokenA.address].loadRoutes(
				tokenA.address,
				tokenA.address
			)
			console.log(2)
			} catch (err){
				console.log(err)
			}
		})
		spinner.text = "Loading routes for the first time...";

		
		cache.isSetupDone = true;
		spinner.succeed("Setup done!");

		return { prisms, prisms2,tokenA, tokenB, market, reserve };
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
