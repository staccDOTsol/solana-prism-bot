const fs = require('fs')

async function ha (){

var afile = JSON.parse( fs.readFileSync('./newanswers.json').toString() )
console.log(afile["MARpDPs5A7XiyCWPNH8GsMWPLxmwNn9SBmKvPa9LzgA"])}

ha () 