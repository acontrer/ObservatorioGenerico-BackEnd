var	config = require('../config.js');

var dbModel= require('../Dao/db.js')

var db=dbModel.getDbInstance();

var ObjectID = require('mongodb').ObjectID;

module.exports.getTypeEntities = function(obs,user,typestr,callback) {

		db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}

		collection.find({"observatory":obs,"tipo":typestr}).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
			});
		});

}
module.exports.getEntities = function(obs,user,consulta,callback) {

		db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}

		collection.find({"observatory":obs,"user":user,"consulta":consulta}).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
			});
		});

}

module.exports.addEntity = function(obsId,entity,callback) {


db.open(function(err, db) {

	db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}
		console.log(entity)

		collection.insert(entity).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		});
	});
	});
}

module.exports.updateEntity = function(obsId,entityId,entity,callback) {


	db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}
		console.log(entity)

		collection.update({_id:new ObjectID(entityId)},entity).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		});
	});

}


module.exports.getAllEntities = function(callback) {

	db.open(function(err, db) {

		db.collection("entity").find().toArray(function(err, items) {

				if(err) {
					callback("Can't retrieve Entities", null);
					return;
				}


				callback(null, items);

		});
	});
}

module.exports.removeEntity = function(id,callback) {
	console.log("REMOVE!!!!!!!"+id)

	db.open(function(err, db) {

		db.collection("entity").remove({"_id":new ObjectID(id)},function(err, response) {
				console.log(response)

				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	});
}


module.exports.removeObservatoryEntities = function(obs,user,callback) {
	console.log("REMOVE ALL!!!!!!!"+id)

	db.open(function(err, db) {

		db.collection("entity").remove({"observatory":obs,"user":user},function(err, response) {
				//console.log(response)

				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	});
}

module.exports.removeUserEntities = function(user,callback) {
	console.log("REMOVE USER ENTITIES!!!!!!!"+user)

	db.open(function(err, db) {

		db.collection("entity").remove({"user":user},function(err, response) {
				//console.log(response)

				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	});
}

module.exports.removeQueryEntities = function(obs,query,user,callback) {
	console.log("REMOVE ALL QUERY ENTITIES!!!!!!!"+id)

	db.open(function(err, db) {

		db.collection("entity").remove({"observatory":obs,"user":user,"consulta":query},function(err, response) {
				//console.log(response)

				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	});
}




module.exports.getEntity = function( id,callback) {

	db.collection("entity").find({name:id},{accounts:0}).toArray(function(err, items) {

		if(items.length==0) {
				callback("Not Found	 Entity", null);
				return;
			}

		items=items[0];

		if(items["Twitter"]!=undefined){

			cuentas=items["Twitter"].split("\n");

			getInfoAccount(cuentas[0],function(err,info){

				if(err){
					var o=new Object();
				o.profile=items;
				//o.account=null;

				callback(null, o);
					//callback(err,null)
					return;
				}

				var o=new Object();
				o.profile=items;
				o.account=info;

				callback(null, o);
			})
		}
		else{
			var o=new Object();
				o.profile=items;
			callback(null,o);
		}


	});

}
module.exports.updateAccounts= function(id,values ,callback) {

	db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}

		collection.update({name:id},{$set:{accounts:values}},function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		});
	});
}


module.exports.updateMetrics = function(id,values ,callback) {


	db.collection("entity", function(err, collection) {

		if(err) {

				callback(err, null);
			return;
		}

		collection.update({_id:new mongo.ObjectID(id)},{$set:{metrics2:values}},function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		});
	});
}

getInfoAccount = function( id,callback) {

	id=id.replace("@"," ").trim();

	db.collection("accounts", function(err, collection) {

		if(err) {

				callback("ss", null);
			return;
		}

		collection.findOne({"screen_name":id},
						{"screen_name":1,
						"statuses_count":1,
						"followers_count":1,
						"friends_count":1},function(err, items) {

						if(items==null) {
							callback("asdas", null);

							return;
							}else{

							items["followerRank"]=items["followers_count"]/(items["followers_count"]+items["friends_count"]);
							callback(null, items);}
		});
	});
}
module.exports.getAccount = function( id,callback) {

	id=id.replace("@"," ").trim();

	db.collection("accounts", function(err, collection) {

		if(err) {

				callback("ss", null);
			return;
		}

		collection.findOne({"screen_name":id},function(err, items) {

						if(items==null) {
							callback("asdas", null);

							return;
							}else{

							callback(null, items);}
		});
	});
}

module.exports.topEntities = function( type,callback) {

	var metric="metrics."+type;

	db.collection("entity", function(err, collection) {

		if(err) {

				callback("ss", null);
			return;
		}

		collection.find().sort({"metrics.GA":-1}).limit(7).toArray(function(err, items) {

						if(items==null) {

							callback("asdas", null);

								return;
							}else{

							callback(null, items);}
		});
	});
}

module.exports.getGlobalActivity = function( id,callback) {

	db.collection("accounts", function(err, collection) {

		if(err) {

				callback("ss", null);
			return;
		}

		//db.accounts.aggregate({ $group: { _id :null, sum : { $sum: "$statuses_count" } } })
		collection.aggregate({ $group: { _id :null, sum : { $sum: "$statuses_count" } } },function(err, items) {

						if(items==null) {
							callback("asdas", null);

							return;
							}else{

							callback(null, items);}
		});
	});
}

module.exports.metricsProc = function(entity,docs,callback) {
	var ot1=0;
	var rt1=0;
	var dt1=0;
	for(var t in docs){
		str=docs[t]["text"]
		if(str!=undefined){
			if(str.charAt(0)+str.charAt(1)=="RT")
				rt1++;
			else{
				if(docs[t].autor==entity){
					ot1++;
				}
			}
		}

	}

	var metrics=new Object();
	metrics.authotingLevel=ot1/(ot1+dt1+rt1);
	callback(null,metrics);
}
