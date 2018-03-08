var config = require('../config.js');

var dbModel= require('../Dao/db.js')

var db=dbModel.getDbInstance();



module.exports.getUser = function(name, pass, callback) {
	
	db.collection("user", function(err, collection) {
	
		if(err) {
	
			callback(err, null);
	
			return;
		}

		collection.findOne({"name":name,"password":pass},function(err, items) {

			if(err) {
                                console.log("AAAAAAAA")
                                callback(err, null);
				return;
			}
                        console.log(items)
			callback(null, items);
		});
		
	});
}





module.exports.addUser = function(name, pass, email, callback) {
	console.log("ADD USER!")
	db.collection("user", function(err, collection) {
	
		if(err) {
	
			callback(err, null);
	
			return;
		}

		collection.insert({"name":name,"password":pass,"email":email},function(err, items) {

			if(err) {
                                  console.log(err.code)
				
				callback(err, null);
				return;
			}
			callback();
		});
		
	});
}


module.exports.updateUser = function(param, callback) {
	
	var pass=param.password;
	var name=param.name;
	var params=param.params;

	
	db.collection("user", function(err, collection) {
		
		if(err) {
	
			callback(err, null);
	
			return;
		}

		collection.update({"name":name,"password":pass},{$set:params},function(err, items) {
			
			if(err) {

				callback(err, null);
				return;
			}
			callback(null, items);
		});
		
	});
}


module.exports.updatePassword = function(name,password,newPassword, callback) {
	

	console.log("updatePass")
	db.collection("user", function(err, collection) {
		if(err) {  console.log("ERROR1")
	                console.log(err)
			callback(err, null);
	
			return;
		}

		collection.update({"name":name,"password":password},{$set:{"password":newPassword }  },function(err, items) {			
			if(err) {
                                console.log("Error")
                                console.log(err)
				callback(err, null);
				return;
			}
			callback(null, String(items.result.nModified));
		});
		
	});
}


module.exports.delete = function(name,password,callback) {
        db.collection("user", function(err, collection) {
		if(err) {  console.log("ERROR1")
	                console.log(err)
			callback(err, null);
	
			return;
		}
        
		collection.remove({"name":name,"password":password},function(err, items) {			
			if(err) {
                                console.log("Error")
                                console.log(err)
				callback(err, null);
				return;
			}
                        
                        console.log("DELETED:"+items)
			callback(null, items);
		});
		
	});
}
