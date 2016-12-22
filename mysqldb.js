var mysql = require('mysql');
var conn = mysql.createConnection({
	host:'120.25.103.101',
	user:'root',
	password:'sdh102+',
	dateStrings:true,
});

exports.getReports = function(fn){
	var result = "";
	conn.query('use error');
	conn.query('select * from error order by datetime desc',function(err,rows,fields){
		if(err){
			console.log(err);
			throw err;
		}
		if(fn){
			fn(rows);
		}
	});	
}

exports.addReport = function(params){
	conn.query('use error');
	var sql = 'insert into error(url,filename,lineno,msg,browser,ip,datetime) values(?,?,?,?,?,?,now())';
	var paramlist = [params.url,params.filename,params.lineno,params.msg,params.browser,params.ip];
	conn.query(sql,paramlist,function(err,result){
		if(err){
			console.log('db operate error!');//throw err;
		}
	});	
}

exports.close = function(){
	conn.end();
}