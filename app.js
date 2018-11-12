/**
 * Created by Лев on 30.04.2018.
 */
var express = require('express'),
    bodyParser = require('body-parser');
var app = express();
var url1='mongodb://127.0.0.1:27017/names';
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
app.use(bodyParser.json());//to parse json
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

var JSONSave;
app.get('/load',function(rq,res){
    res.send(JSONSave);
})
app.post('/save',function(req,res){
    JSONSave=req.body;
    console.log(JSONSave);
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});