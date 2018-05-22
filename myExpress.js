// JavaScript Document

var express = require('express');
var ejs = require('ejs');
var resources = require('./resources/resources');
var qs = require('querystring')
var app = express.createServer();

//使用ejs模板
app.set("view engine", "ejs"); 

//设定文件路径
app.set('views', __dirname + '\\view');
app.set('view options', {
	layout: false
});

console.log('RUN');
//主页
app.get('/home', function (req, res) {
	
	//响应页码
	res.render('home.ejs', {
	});
	console.log('/home method = GET');
});


app.get('/temperature', function (req, res) {
	//响应数据
	res.send('temperature:' + resources.STM32.sensors.temperature.value);
	console.log('/temperature method = GET');
});

app.get('/humidity', function (req, res) {
	res.send('humidity:' + resources.STM32.sensors.humidity.value);
	console.log('/humidity method = GET');
});

app.get('/pir', function (req, res) {
	res.send('pir:' + resources.STM32.sensors.pir.value);
	console.log('/humidity method = GET');
});

app.post('/temperature', function (req, res) {
	//检查是否登入避免用户无写入
	if(req.query.login == 1){
		//数据修改
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
