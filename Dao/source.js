var config = require('../config.js');
var dbModel= require('../Dao/db.js')
var db=dbModel.getDbInstance();

module.exports.getSources = function(callback) {
	
	db.collection("sources", function(err, collection) {
		
		if(err) {
		
				callback(err, null);

			return;
		}
	
		collection.find().sort({country:1}).toArray(function(err, items) {

			if(err) {

				callback(err, null);

				return;
			}

			callback(null, items);
		});
	});
}
