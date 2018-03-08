var config = require('../config.js');

var dbModel= require('../Dao/db.js')

var db=dbModel.getDbInstance();

var ObjectID = require('mongodb').ObjectID; 

module.exports.addQueries = function(obsId,date,callback) {

	db.collection("consultas", function(err, collection) {
			console.log("XDssss")
		if(err) {
		
				callback(err, null);
			return;
		}
		
		date.observatory=obsId;
		
		collection.insert(date).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		});
	});
}

module.exports.getQueries = function(obs, user,callback) {


		db.collection("consultas", function(err, collection) {
		
		if(err) {
		
				callback(err, null);
			return;
		}
		
		collection.find({"observatory":obs,"user":user}).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
			});
		});
}

module.exports.getQuery = function(obs,query,user,callback) {

		db.collection("consultas", function(err, collection) {
		
		if(err) {
		
				callback(err, null);
			return;
		}
		
		collection.find({"observatory":obs,"consulta":query,"user":user}).toArray(function(err, items) {


			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
			});
		});

}
module.exports.updateQuery = function(obsId,queryID,obUpdate,callback) {
	

	db.collection("consultas", function(err, collection) {
		
		if(err) {
		
				callback(err, null);
			return;
		}
		
		collection.update({"observatory":obsId,"consulta":queryID},{$set:obUpdate}, function(err, items) {

			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		
	});

})
}



module.exports.updateQueryByMongoId = function(id,query,callback) {
	

	db.collection("consultas", function(err, collection) {
		
		if(err) {
		
				callback(err, null);
			return;
		}

		collection.update({"_id":new ObjectID(id)},{$set:query}, function(err, items) {

			if(err) {
				callback(err, null);
				return;
			}

			callback(null, items);
		
	});

})
}




module.exports.removeQuery = function(id,cons, user,callback) {

	db.collection("consultas").remove({observatory:id,consulta:cons,user:user},function(err, response) {
					
				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	
}

//Remove all the queries associated to a specific observatory and user
module.exports.removeObservatoryQueries = function(obs,user,callback) {

	db.collection("consultas").remove({observatory:obs,user:user},function(err, response) {
					
				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	
}


module.exports.removeUserQueries = function(user,callback) {

	db.collection("consultas").remove({user:user},function(err, response) {
					
				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});
	
}
