const fs = require('fs')

async function ha (){

var afile = JSON.parse( fs.readFileSync('./answersusdc.json').toString() )
let c = -1
var newobj = {}
for (var lutlist of Object.values(afile)){
    c++
    let c2 = -1
for (var addy of Object.keys(afile)[c].split(',')){
c2++ 
if (c2 > 0){
    if (!Object.keys(newobj).includes(addy)){
    newobj[addy] = lutlist
    
}
newobj[addy].push(...lutlist)
}
}
}
fs.writeFileSync('./newanswers.json', JSON.stringify(newobj))
}

ha () 