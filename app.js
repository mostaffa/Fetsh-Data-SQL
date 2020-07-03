const https = require('https');
const fs = require('fs');
const path = require("path")
console.log(path.join(__dirname+"/data.json"))
const url = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&outFields=Bundesland,IdBundesland,AnzahlFall,Landkreis&outSR=4326&f=json"
https.get(url, res=>{
    let data = "";
    res.on('data', chunk=>{
        data += chunk;
    });

    res.on('end',()=>{
       let obj = JSON.parse(data)['features']
        //console.log(data)
        fs.writeFile(path.join(__dirname+"/data.json"),JSON.stringify(obj),"utf8",(error,d)=>{
            if(error)
            console.log(error)
        })
    });
    res.on("error", (err)=>{
        console.log("Error: "+ err.message);
    })
});