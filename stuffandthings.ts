import { AddressLookupTableProgram, Connection, GetProgramAccountsConfig, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
const PromisePool = require("@supercharge/promise-pool").default;

import fs from 'fs'
setTimeout(async function(){
// invalid cache. I will recommend using a paid RPC endpoint.
let  connection = new Connection((process.env.NODE_ENV == 'production' ? 'https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ' : 'https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ'));
var connection2= connection

process.env.SEARCHER ? connection = connection2 : connection = connection
const configOrCommitment: GetProgramAccountsConfig = {
    commitment: 'confirmed',
    filters: [
     
    ],
  };
  let ammIds : any= []
  let ammIdspks : any = []

  for (var i =0 ;i <= 1818; i++){
    try {
let file = JSON.parse(fs.readFileSync('./usdctousdc' + i.toString() + '.json').toString())
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
}
    catch (err){} 
}
let theluts : any = []
console.log(ammIds.length)
let myluts: any = {}

    let luts = await connection2.getProgramAccounts(AddressLookupTableProgram.programId)
    console.log(luts.length)
    await PromisePool.withConcurrency(200)
    .for(luts)
    // @ts-ignore
    .handleError(async (err, asset) => {
      console.error(`\nError uploading or whatever`, err.message);
      console.log(err);
    })
    // @ts-ignore
    .process(async (lut: any) => {
      // @ts-ignore
      let maybemine = await connection2.getAddressLookupTable(lut.pubkey)
      
if(maybemine.value?.state.addresses.length as number > 200){
    // @ts-ignore
    for (var addy of maybemine.value?.state.addresses){
let addypk = addy.toBase58()
for (var pk of ammIdspks){

    if ( pk === addypk && !Object.keys(theluts).includes(pk)){
        theluts[pk] = [lut.pubkey.toBase58()]

    } else if ( pk === addypk){
    theluts[pk].push (lut.pubkey.toBase58())
    console.log(Object.keys(theluts).length)

       
}
fs.writeFileSync('./powerfulluts.json', JSON.stringify(theluts))

}
    

    }
}
    })
    console.log(Object.keys(theluts).length)
})
