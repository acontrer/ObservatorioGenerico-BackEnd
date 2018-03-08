var	config = require('../config.js');

var dbModel= require('../Dao/db.js')

var db=dbModel.getDbInstance();

module.exports.removeUserObservatories = function(user,callback) {
	console.log("REMOVE USER OBSERVATORIES!!!!!!!"+user)	
		db.collection("observatory").remove({"user":user},function(err, response) {
				//console.log(response)
				
				if(response==null) {

						callback("Not Entity Obs", null);

					return;
				}

				callback(null, response);
		});

}



module.exports.create = function(param, callback) {
	console.log(param)
	var pass=param.password;
	var name=param.name;
	var params=param.params;
       //  param.visualizator = [ { "name" : "timeSerie ", "size" : "3" }, { "name" : "geo ", "size" : "3" }, { "name" : "topWords ", "size" : "3" }, { "name" : "url ", "size" : "3" }, { "name" : "media ", "size" : "3" }, { "name" : "document ", "size" : "3" }, { "name" : "donut ", "size" : "3" }, { "name" : "news ", "size" : "3" } ]
         param.visualizator = [ { "name" : "timeSerie ", "size" : "3" }, { "name" : "media ", "size" : "3" }, { "name" : "donut ", "size" : "3" }, { "name" : "topWords ", "size" : "3" }, { "name" : "geo ", "size" : "3" }, { "name" : "url", "size" : "3" } ]
         param.style="darkly" 	
        if(param.id==undefined);
		//param.id=param.name.replace(" ","");
		param.id=param.name
		console.log(param)
	db.collection("observatory", function(err, collection) {
		
		if(err) {
                        console.log(err)	
			callback(err, null);
	
			return;
		}

                if (param.edit==undefined) {

		collection.insert(param,function(err, items) {
			
			if(err) {
                                console.log(err)
				callback(err, null);
				return;
			}
			callback(null, items);
		});
	
                }

                else {
                delete param["edit"]
		collection.updateOne({id:param.id},param,function(err, items) {
			
			if(err) {
                                console.log(err)
				callback(err, null);
				return;
			}
			callback(null, items);
		});                



                }
	
	});

}

module.exports.delete = function(id , user, callback) {

	db.collection("observatory", function(err, collection) {
	
		if(err) {
	
			callback(err, null);
	
			return;
		}

		collection.remove({"id":id,"user":user},function(err, items) {

			if(err) {

				callback(err, null);
				return;
			}
			callback(null, items);
		});
		
	});
}
