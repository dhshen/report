var express = require('express');
var db = require('./mongodb');
var ejs = require('ejs');
var app = express();

app.set("view engine","ejs");
app.use(express.static('app'));

app.get('/',function(req,res){
	db.getReports(function(data){
		try{
			res.render("index",{"list":data});
		}catch(e){
			console.log(e);
		}
	});
});

app.get('/data/addReport',function(req,res){
	var params = req.query;
	params.ip = getClientIp(req);
	db.addReport(params);
	res.end();
});

function getClientIp(req){

	var ipstr = null;
    var forwardIpStr = req.headers['x-forwarded-for'];
    if (forwardIpStr) {
        ipstr = forwardIpStr.split(',')[0];
    }else{
    	ipstr = req.connection.remoteAddress;
		var reg = /\d+\.\d+\.\d+\.\d+/;
		var arr = reg.exec(ipstr);
		if(arr){
			ipstr = arr[0];
		}else{
			ipstr = 'unknow';
		}
    }
	return ipstr;
}

app.use(function(req,res,next){
	res.status(404).send('404,NOT FOUND!');
});

var server = app.listen(8083,function(req,res){
	console.log('Server start...');
});
