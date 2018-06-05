// JavaScript Document
//Ubuntu 后台运行： nohup node myExpress.js &

var express = require('express');
var qs = require('querystring')
var ejs = require('ejs');
var net = require('net');
var resources = require('./Resources/resources');

var app = express.createServer();

var con;
//使用ejs模板
app.set("view engine", "ejs");

//设定文件路径
app.set('views', __dirname + '/view');
app.set('view options', {
	layout: false
});

app.disable('x-powered-by');
console.log('RUN');

//主页
app.get('/home', function (req, res) {
	//响应页码
	res.render('home.ejs', {});
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

app.get('/lcd', function (req, res) {
	res.send([
		'<form method="POST" action="/lcd">', 
		'<h1>LCD 1602显示内容提交</h1>', '<fieldset>', 
		'<label>只可以显示ASCII</label>', 
		'<p></p>', 
		'<input type="text" name="lcd">', 
		'<p><button>提交</button></p>', 
		'</form>'
	].join(''));
	console.log('/lcd method = GET');
});

app.post('/temperature', function (req, res) {
	
	//检查是否登入避免用户无写入
	if (req.query.login == 1) {
		//数据修改
		resources.STM32.sensors.temperature.value = req.query.temperature;
	}
	res.send('temperature:' + resources.STM32.sensors.temperature.value);
	console.log('/humidity method = POST');
});

app.post('/humidity', function (req, res) {
	if (req.query.login == 1) {
		resources.STM32.sensors.humidity.value = req.query.humidity;
	}
	res.send('humidity:' + resources.STM32.sensors.humidity.value);
	console.log('/humidity method = POST');
});

app.post('/pir', function (req, res) {
	if (req.query.login == 1) {
		resources.STM32.sensors.pir.value = req.query.pir;
	}
	res.send('pir:' + resources.STM32.sensors.pir.value);
	console.log('/humidity method = POST');
});

app.post('/lcd', function (req, res) {
	var body = "";
	req.on('data', function (chunk) {
		body += chunk;
	});
	req.on('end', function () {
		if (req.query.login == 1) {
			res.send('lcd:' + resources.STM32.actuators.lcd.value);
		} else {
			resources.STM32.actuators.lcd.value = qs.parse(body).lcd;
			res.send('lcd:' + resources.STM32.actuators.lcd.value);
			
			//保证在STM32接入后
			if(con != null){
				con.write('lcd:' + resources.STM32.actuators.lcd.value);
			}
		}
	});
	console.log('/lcd method = POST');
});

app.listen(3000);

var server = net.createServer(function (conn) {
	//设定编码
	conn.setEncoding('utf8');
	
	//将LCD屏数据传输到STM32
	conn.write("lcd:" + resources.STM32.actuators.lcd.value);
	
	//不考虑多终端连接入
	con = conn;
	console.log("conn STM32\r\n");

	conn.on('data', function(data){
		try{
			var ojb = JSON.parse(data);
			
			//读取到的信息进行储存
			if(ojb.pir){
				resources.STM32.sensors.pir.value = ojb.pir;
			}
			if(ojb.temperature){
				resources.STM32.sensors.temperature.value = ojb.temperature;
			}
			if(ojb.humidity){
				resources.STM32.sensors.humidity.value = ojb.humidity;
			}
		}catch(e){
			console.log(e);
		}
	});
	
});

//监控3001端口
server.listen(3001, function () {
	console.log("server listening on *:3001");
});