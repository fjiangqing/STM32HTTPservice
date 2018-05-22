// JavaScript Document

var express = require('express');
var ejs = require('ejs');
var search = require('./search');
var resources = require('./resources');
var qs = require('querystring')
var app = express.createServer();

app.set("view engine", "ejs"); 
app.set('views', __dirname + '\\view');
app.set('views', __dirname);
app.set('view options', {
	layout: false
});

console.log(app.set('views'));


app.get('/home', function (req, res) {
	app.set('views', __dirname + '\\view');
	res.render('STMHome.ejs', {
	});
	console.log('/home method = GET');
});


app.get('/temperature', function (req, res) {	
	res.send('temperature:' + resources.STM32.sensors.temperature.value);
	console.log('/temperature method = GET');
});

app.get('/humidity', function (req, res) {
	//app.set('views', __dirname + '\\view');
	
	//res.type('text/plain');
	res.send('humidity:' + resources.STM32.sensors.humidity.value);
	console.log('/humidity method = GET');
	//res.render('index.html');
});

app.get('/pir', function (req, res) {
	//res.type('application/json');
	res.send('pir:' + resources.STM32.sensors.pir.value);
	console.log('/humidity method = GET');
	//res.render('index.html');
});

app.post('/temperature', function (req, res) {
	if(req.query.login == 1){
		resources.STM32.sensors.temperature.value = req.query.temperature;
	}
	res.send('temperature:' + resources.STM32.sensors.temperature.value);
	console.log('/humidity method = POST');
});

app.post('/humidity', function (req, res) {
	if(req.query.login == 1){
		resources.STM32.sensors.humidity.value = req.query.humidity;
	}
	res.send('humidity:' + resources.STM32.sensors.humidity.value);
	console.log('/humidity method = POST');
});

app.post('/pir', function (req, res) {
	if(req.query.login == 1){
		resources.STM32.sensors.pir.value = req.query.pir;
	}
	res.send('pir:' + resources.STM32.sensors.pir.value);
	console.log('/humidity method = POST');
});

app.listen(3000);
