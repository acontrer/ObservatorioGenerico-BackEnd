var mongo = require('mongodb')
var	config = require('../config.js')
var	Server = mongo.Server
var	Db = mongo.Db;
var elasticsearch = require('elasticsearch');
var server = new Server(config.host, config.port, {auto_reconnect:true});
var db = new Db(config.db, server, {safe:true});

db.open(function(err, db) {
	
});

module.exports.getDbInstance = function() {
	return db;
}


module.exports.close=function(){
	db.close();
}


module.exports.getObservatories = function(user, callback) {
	
	db.collection("observatory", function(err, collection) {
		
		if(err) {
		
				callback(err, null);

			return;
		}
	
		collection.find({"user":user},{"id":1,"name":1,"description":1,"user":1}).toArray(function(err, items) {

			if(err) {

				callback(err, null);

				return;
			}

			callback(null, items);
		});
	});
}

module.exports.getObs = function(name,user,callback) {
	
	var keywords=new Array();


		db.collection("observatory").findOne({"id":name,"user":user},function(err, observatory) {
	
			if(observatory==null) {

					// console.log(err);
					callback("Not Found Obs", null);

				return;
			}
			if(observatory["keywords"]!=undefined)
				for(i=0;i<observatory["keywords"].length;i++){
					
					keywords.push(observatory["keywords"][i]["w"]);
				}


				db.collection("entity").find({"observatory":name,"user":user,keywords:{"$exists":true}},{keywords:1,_id:0}).toArray(function(err2, items2) {

					if(err2) {
						console.log(err2);
						callback(err2, null);
						return;
					}

					for(j=0;j<items2.length;j++){
						for(i=0;i<items2[j]["keywords"].length;i++){

							if(items2[j]["keywords"][i]["global"]==1)
								keywords.push(items2[j]["keywords"][i]["w"]);
						}
					}
					
					observatory.keywords=keywords;
					
					callback(null, observatory);
				});
		});

}

