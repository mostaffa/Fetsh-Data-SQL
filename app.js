const https = require('https');
const fs = require('fs');
const path = require("path")
const mysql = require("mysql");

const connectionString = mysql.createConnection({
    host: 'localhost',
    user: 'pi',
    password: '36862',
    database: 'OwnCloud'
});
//connectionString.connect();

const url = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID_1,OBJECTID,Fallzahl,Shape__Length,Death,Aktualisierung&returnGeometry=false&outSR=4326&f=json"
https.get(url, res=>{
    let data = "";
    res.on('data', chunk=>{
        data += chunk;
    });

    res.on('end',()=>{
       let obj = JSON.parse(data)['features']
       // coonection
       connectionString.connect();
       obj.forEach((record,index) => {

           let v1 = parseInt(obj[index].attributes.OBJECTID);
           let v2 = parseInt(obj[index].attributes.Fallzahl);
           //INSERT INTO `Corona`( `Bundesland`, `AnfallZahl`) VALUES (4,4)
           let insertString = 'INSERT INTO OwnCloud.Corona VALUES (null,'+v1+','+v2+')'
           console.log(insertString);
           let q = connectionString.query(insertString, (error, reponse)=>{
               if(error){
                   console.log(error)
               }
           })
       });
       connectionString.end()
       console.log("We HAve : "+ obj.length+" Record")
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