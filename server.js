const express = require("express");
const app = express();
var bodyParser = require("body-parser"),
    path = require("path"),
    fs = require("fs-extra");


function Log() {    
    var line = [];
    
    line.push(new Date());
    
    for(let _i in arguments) 
        line.push(arguments[_i]);    
    
    line.push("\n");
    line = line.join(",");

    fs.appendFile('log.csv', line, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

app.set('port', (process.env.PORT || 3300));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
app.use("/exported-files", express.static(path.join(__dirname, "exported-files")));

app.all("/", function(req, res){
    Log("SUCCESS", "App visted");
    res.render("index.html");
});

app.post("/download", function (req, res) {
    var data = req.body.data,
        type = req.body.type,
        name = new Date().getTime() + type,
        url = req.protocol + "://" + req.headers.host;

    if(typeof data !== "string")
        data = JSON.stringify(data, null, 4);

    fs.writeFile(["./exported-files/export-", name].join(""), data, function(err, data){
        if(err)
            Log("ERROR", "error on file writing");

        Log("SUCCESS", "Export successfull.", type, "export-"+name);
        res.send({ 
            url : [url, "/exported-files/export-", name].join(""),
            type: type
        });    
    }); 
});

app.listen(app.get('port'), function () {
  console.log(`Example app listening on port ${app.get('port')}`);
});

/**
 * clearing all the exported files at interval of 1 HR
 */
setInterval(function(){
    fs.emptyDir("./exported-files", function(err){
        if(err)
            Log("ERROR", "error while clearing the exported files folder.");
        
        Log("SUCCESS", "all exported files cleared from exported-files folder");
    });
}, 1000 * 60 * 60);
