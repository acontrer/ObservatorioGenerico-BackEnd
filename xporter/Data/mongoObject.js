	// var mongo = require('mongodb'),
	config = require('../config.js');
	var fs = require('fs');

	// var server = new mongo.Server(config.host, config.port, {auto_reconnect:true});
	// var db = new mongo.Db(config.db, server, {safe:true});

	var dbModel= require('../../Dao/db.js')

	var db=dbModel.getDbInstance();

	var queriesAll=new Object();
	
	var method = BagOfWords.prototype;
	// var folder="tmpFiles/";

	var indexes="lasegunda,emol,ltpaper,inversiones,legal,mediosregionales,lanacion,elmostrador";
	var special=null;
	var metric =null;

	function BagOfWords(){
		// this.folder="tmpFiles/"
		console.log("init")
	}



	BagOfWords.prototype.getBag=function(id,user,consulta,callback){
		queriesAll=new Object();
		var ref=this;
			var collectionObs = db.collection('observatory');
			
			var collection = db.collection('entity');

			collectionObs.find({'name':id}).toArray(function(err, obs) {	
				console.log(obs)
				ref.setIndexes(obs[0]["sources"].join(","))		
		
				collection.find({'observatory':id,"user":user,"consulta":consulta}).toArray(function(err, items) {
console.log(items)
					ref.setSince(items[0]["date"].split(" - ")[0])

					ref.setUntil(items[0]["date"].split(" - ")[1])

					if(err) {
						// callback(err, null);
						return;
					}

					for(i=0;i<items.length;i++){

						var arr=new Array();
						for(j=0; j<items[i]["terms"].length;j++){
							
							arr.push(items[i]["terms"][j]["w"])
						}
						queriesAll[items[i]["name"]]=arr;
					}
					callback( queriesAll);
				});
			});

		
	}
	BagOfWords.prototype.getIndexes=function(){
		return this.sources;
	}
	BagOfWords.prototype.setIndexes=function(sources){
		 this.sources=sources;
	}


	BagOfWords.prototype.getSpecialQuery=function(){
		return special;
	}
	BagOfWords.prototype.getQueries=function(){
		return this.queriesAll;
	}

	BagOfWords.prototype.getSince=function(){
		// return  "2016-10-01";
		return this.since;
	}

	BagOfWords.prototype.getUntil=function(){
		// return  "2016-12-01";
		return this.until;
	}



	BagOfWords.prototype.setSince=function(date){
		this.since=date;
	}

	BagOfWords.prototype.setUntil=function(date){
		this.until=date;
	}

	BagOfWords.prototype.getFolder=function(){
		console.log("getFolder")
		console.log(this.id)
		return  this.folder;
	}

	BagOfWords.prototype.setFolder=function(newFolder){
		fs.mkdir(this.folder+newFolder,function(err,data){
		//console.log(err)
		})
		this.folder=newFolder;
	}


	BagOfWords.prototype.getAllQueries=function(){

			return null;
	}
	BagOfWords.prototype.getMetric=function(){
		return metric;
	}
module.exports = BagOfWords;
