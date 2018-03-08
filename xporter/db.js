var mongo = require('mongodb'),
	config = require('./config.js'),
	solr = require('solr-client'),
	Server = mongo.Server,
	Db = mongo.Db;
var elasticsearch = require('elasticsearch');
var server = new Server(config.host, config.port, {auto_reconnect:true});
var db = new Db(config.db, server, {safe:true});

db.open(function(err, db) {
	
});

module.exports.getMentions = function(politicosID, since, until, callback) {
	db.collection("metrics_entity", function(err, collection) {
		if(err) {
			callback(err, null);
			return;
		}
	
collection.find({'operators.date':{$gte:since,$lt:until},'keyWord':politicosID}).toArray(function(err, items) {

		if(err) {
				callback(err, null);
				return;
			}
			callback(null, items);
		});
	});
}

module.exports.updateTweet=function(t){
	console.log("updating")
	
	db.collection("tweets", function(err, collection) {
		
		for(tweet in t){	
			
			collection.update({ "_id":t[tweet]}, { $set: { "indexed":config.indexed_id } } );  
		
				
		}
		
	})
}

module.exports.close=function(){
	db.close();
}

module.exports.getCursorToIndex=function(callback){

	db.open(function(err, db) {
		
		db.collection("tweets", function(err, collection) {
			if(err) {
				callback(err, null);
				return;
			}

			var arr=new Array();
			// var cursor=collection.find().limit(1000);
			var cursor=collection.find({"indexed":{$ne:config.indexed_id}}).limit(1000);

			callback(null,cursor);

		});
	});
}


module.exports.getObservatories = function( callback) {
	
	db.collection("observatory", function(err, collection) {
		
		if(err) {
		
				callback(err, null);

			return;
		}
	
		collection.find({},{"id":1,"name":1,"description":1}).toArray(function(err, items) {

			if(err) {

				callback(err, null);

				return;
			}

			callback(null, items);
		});
	});
}

module.exports.getObs = function(name,callback) {

	var keywords=new Array();
	db.open(function(err, db) {

		db.collection("observatory").findOne({"id":name},function(err, observatory) {
	
			if(observatory==null) {

					// console.log(err);
					callback("Not Found Obs", null);

				return;
			}
			
			for(i=0;i<observatory["keywords"].length;i++){
				
				keywords.push(observatory["keywords"][i]["w"]);
			}


				db.collection("entity").find({"observatory":name,keywords:{"$exists":true}},{keywords:1,_id:0}).toArray(function(err2, items2) {

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
	});
}


module.exports.getAllObs = function(callback) {
	db.open(function(err, db) {

	var keywords=new Array();

	db.collection("observatory").find().toArray(function(err, observatory) {
	
	
	
		if(observatory==null) {

				console.log(err);

				callback("Not Found Obs", null);

			return;
		}
		
		for(i=0;i<observatory["keywords"].length;i++){
			
			keywords.push(observatory["keywords"][i]["w"]);
		}
	
		//db.entity.find({keywords:{"$exists":true}},{"keywords.$.w":1,observatory:1,_id:0});


		db.collection("entity").find({"observatory":observatory.id,keywords:{"$exists":true}},{keywords:1,_id:0}).toArray(function(err2, items2) {

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
});
}

module.exports.getRetrieveTweets = function(docLst,h1,h2,rangeType, callback) {

	db.collection("tweets", function(err, collection) {
		if(err) {
			callback(err, null);
			return;
		}
	
	collection.find({id:{$in:docLst}}).toArray(function(err, items) {

			//collection.find({'date': {$gte: since, $lt: until}}).toArray(function(err, items) {
				if(err) {
					callback(err, null);
					return;
				}

				if(h1!=null)
					timeFilterProc(items,h1,h2,rangeType,function(itemsProc){
						
						callback(null, itemsProc);

					})
				else
					callback(null, items);
				
		});
	});
}

function timeFilterProc(tweets,h1,h2,rangeType,callback) {
	
	var output=new Array();
	
	for(var i=0;i<tweets.length;i++){
	
		var d1=new Date(Date.parse(tweets[i]['created']));
		
		if(rangeType=="OR"){
			if(d1.getHours()<=h1||d1.getHours()>=h2)
				output.push(tweets[i]);
		}else{
			if(d1.getHours()>=h1&&d1.getHours()<=h2)
				output.push(tweets[i]);
		}
	}

	callback(output);
	
}

module.exports.getTopK = function(docLst, callback) {
	db.collection("tweets", function(err, collection) {
		if(err) {
			callback(err, null);
			return;
		}
	
collection.find({id:{$in:docLst}},{cleantext:1,_id:0}).toArray(function(err, items) {

			if(err) {
				callback(err, null);
				return;
			}
			callback(null, items);
		});
	});
}


module.exports.getGeoRef = function(docLst, callback) {
	db.collection("tweets", function(err, collection) {
		if(err) {
			callback(err, null);
			return;
		}
	
	collection.find({id:{$in:docLst}},{mLocation:1,uLocation:1,_id:0}).toArray(function(err, items) {

		
			if(err) {
				callback(err, null);
				return;
			}
			callback(null, items);
		});
	});
}