'use strict';
const PORT = 8000;

var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());


app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get("/gettodos", (req, res) => {
    var dataArr = [];
    fs.readFile("./database.json", function(err, data) {
        dataArr = JSON.parse(data);
        res.send(data);
    });
});


app.post("/newtodo", (req, res) => {

    var dataArr = [];
    fs.readFile("./database.json", (err, data) => {
        dataArr = JSON.parse(data);
        dataArr.push(req.body);
        fs.writeFile("./database.json", JSON.stringify(dataArr), (err) => {
            console.log("error");
        });
        res.send(dataArr);
    });

});

app.delete("/deletetodo/:index", (req, res) => {

    var dataArr = [];

    console.log(req.params.index);

    fs.readFile("./database.json", (err, data) => {
        dataArr = JSON.parse(data);
        dataArr.splice(req.params.index, 1);

        fs.writeFile("./database.json", JSON.stringify(dataArr), (err) => {
            console.log(err);
        });
        res.send(dataArr);
    });
});

app.post("/updatetodo/:index", (req, res) => {

    var dataArr = [];

    console.log(req.params.index);

    fs.readFile("./database.json", (err, data) => {
        dataArr = JSON.parse(data);
        dataArr[req.params.index]["completed"] = !dataArr[req.params.index]["completed"];

        fs.writeFile("./database.json", JSON.stringify(dataArr), (err) => {
            console.log(err);
        });
        res.send(dataArr);
    });
});


var server = http.createServer(app);

server.listen(PORT, function() {
    console.log(`listening on port:${PORT}`);
});