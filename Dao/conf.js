var	config = require('../config.js');

var dbModel= require('../Dao/db.js')

var db=dbModel.getDbInstance();


module.exports.getConf = function(callback) {
	
	db.collection("widget", function(err, collection) {
	
		if(err) {
	
			callback(err, null);
	
			return;
		}

		collection.find({},{}).toArray(function(err, items) {
			var out=new Object();
			if(err) {

				callback(err, null);
				return;
			}

			for(i=0;i<items.length;i++){
				
			}
			callback(null, items);
		});
		
	});
}
