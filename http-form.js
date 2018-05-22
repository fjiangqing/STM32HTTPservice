// JavaScript Document

var qs = require('querystring');
module.exports = require('http').createServer(function(req, res){
//	res.setEncoding('utf8');
	if ('/' == req.url) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		
		//HTML 内容
		res.end([
				'<form method="POST" action="/url">'
			,	'<h1>My form</h1>'
			,	'<fieldset>'
			,	'<label>Personal information</label>'
			,	'<p>What is your name?</p>'
			,	'<input type="text" name="name">'
			,	'<p><button>Submit</button></p>'
			,	'</form>'
		].join(''));
	}else if('/url' == req.url && 'POST' == req.method){
		var body = '';
		
		//数据块读取
		req.on('data', function(chunk){
			body += chunk;
		});
		req.on('end', function () {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end('<p>Your name is <b>' + qs.parse(body).name + '</b></p>');
		});
		}
}).listen(3000);