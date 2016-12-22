var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;	//	创建模型
mongoose.connect('mongodb://localhost/report');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var ErrorBean = null;
db.once('open', function (callback) {
	console.log('open mongodb success!');
	var errorSchema = new Schema({
		url:  String,
		filename: String,
		lineno:   Number,
		msg: String,
		browser: String,
		ip: String,
		datetimestr: String,
		datetime: { type: Date, default: Date.now }
	});

	ErrorBean = mongoose.model('Error',errorSchema);
});


exports.getReports = function(fn){
	ErrorBean.find().sort({"datetime":-1}).exec(function(err,data){
		if(err){
			console.log('errorinfo:'+err);
		}else if(fn){
			var t = '';
			for(var d = 0; d < data.length; d++){
				data[d].datetimestr = moment(data[d].datetime).format('YYYY-MM-DD HH:mm:ss');
			}
			fn(data);
		}
	});
}

exports.addReport = function(params){
	var error = new ErrorBean({
	    url:  params.url,
		filename: params.filename,
		lineno:  params.lineno,
		msg: params.msg,
		browser: params.browser,
		ip: params.ip, 
	});
	error.save();
}
