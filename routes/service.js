var util = require('util');
var moment = require('moment');
var db = require('../Dao/db');
var userModel = require('../Dao/user');
var entityModel = require('../Dao/entity.js');
var observatory = require('../Dao/observatory');
var confModel = require('../Dao/conf');
var proc2 = require('../procesamiento.js');
var elasticsearch = require('elasticsearch');
var index=require("../index.js")
var	config = require('../config.js');
var app = require('express');
var router = app.Router();


	router.get('/', home);

	router.get('/user/:name', user);

	router.post('/user/', userPost);

	/*
	Devuelve la configuracion del sitio por usuario
	**** FIX entrega una configuracion por defecto
	*/
	router.get('/configuration/', configuration);

	

	/*
	Devuelve los tweets usuario e identificador del mensaje
	*/
	// router.get('/data/:observatoryID', getService);
	
	router.get('/service/:observatoryID/:userName', getSpecificData);


	
	// router.get('/savedTweets/:observatoryID', getFakeTweets);

	router.get('/topEntities/', topEntities);




	/*
	Devuelve todos los datos del sitio
	*/
	router.get('/alldata/:observatoryID/:userName', getAllData);

	



function home(req, res) {

	res.sendfile('./index.html');

}

function metricsOp(req, res) {

	metrics.calculateMetrics();

}


function configuration(req, res) {

		var name = req.params.name,
			pass =req.query.password;
			

		confModel.getConf(function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.', 400);
			
			} else {
				

				if(results!=null){
					
					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(results, 200);

					}
				else{ 
					res.send('Error with get request.', 400);
				}
		
			}

		});
}
function userPost(req, res) {

			
		userModel.updateUser(req.body, function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.', 400);
			
			} else {
				
				var out= new Object();

				

				if(results!=null){
					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(true, 200);
					}
				else{
					res.send('Error with get request.', 400);
				}
		
			}

		});
}


var objectIdFromDate = function (date) {
	return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};




function user(req, res) {

		var name = req.params.name,
			pass =req.query.password;
			

		userModel.getUser(name, pass, function(err, results) {
			
			if(err) {
				
				res.send('Error with get request1.', 400);
			
			} else {
				
				var out= new Object();

				

				if(results!=null){
					
					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(results, 200);
					}
				else{
					res.send('Error with get request2.', 400);
				}
		
			}

		});
}
function getAllData(req, res) {
	
	getSpecificData(req,res,function(docs){
		//console.log(docs)
		var docsOldFormat=new Object()
		docsOldFormat["mentions"]=new Object();
		docsOldFormat["mentions"]["info"]=docs["donut"]["data"];
		docsOldFormat["mentions"]["data"]=docs["timeSerie"]["data"];

		
		docsOldFormat["data"]=new Object();
		docsOldFormat["data"]["total"]=docs["data"]["total"]

		docsOldFormat["data"]["data"]=docs["document"]["data"];


		docsOldFormat["topWords"]=new Object();
		docsOldFormat["topWords"]["data"]=docs["topWords"]["data"];
		
		docsOldFormat["media"]=new Object();
		docsOldFormat["media"]["data"]=docs["media"]["data"];

		docsOldFormat["urls"]=new Object();
		docsOldFormat["urls"]["data"]=docs["url"]["data"];

		docsOldFormat["geo"]=new Object();
		docsOldFormat["geo"]["data"]=docs["geo"]["data"];
	
		res.header("Content-Type", "application/json; charset=utf-8");

		res.header('Access-Control-Allow-Origin', "*"); 

		res.send(docsOldFormat, 200);
	});
}
function getSpecificData(req, res) {
	
	readInput(req,function(){

		
		index.search2(id,user,query,since,until,function(err,docs){
		
			console.log(docs)
		
			res.header("Content-Type", "application/json; charset=utf-8");
						
			res.header('Access-Control-Allow-Origin', "*"); 
			
			res.send(docs, 200);
		})
	})
}
module.exports.search=function(id,query,since,until,callback) {
	
	search(id,user,query,since,until,callback);

}







function topEntities(req,res) {
		
	readInput(req,function(){
	
		db.getObs("politicos", function(err, observatories) {
			
		if(err) {

			res.send(err, 400);


		} else {
			entityModel.topEntities("followersRank",function(err, entities) {
				if(err) {
					
					res.send('Error with get request.', 400);
				} else {
		

						res.header('Access-Control-Allow-Origin', "*"); 
						res.send(entities, 200);
		
					
					
				}
			});
		}
	})
	})
	

}

function accounts(req,entities,i,callback){
		
		//console.log(i)
		
		if(entities[i]==null){
			//console.log((entities))
			callback(null,entities);
		}
		else{
			getAccount(req,entities[i]["name"],function(err,item){
				entities[i]["account"]=item;
				//console.log(entities[i]["name"])
				accounts(req,entities,i+1,callback)
			})
		}
			
		
			
}


function getAccount(req,screen_name,callback){
	readInput(req,function(){

		entityModel.getEntity(screen_name,function(err, entities) {
					if(err) {
						callback("err", null);
					} else {

							//Considerando una cuenta
							//console.log(entities)
							if(entities.account==undefined){
									callback(null,entities)
								//eturn entities;

 							}else

							db.getIDs2("politicos",entities.account.screen_name, since, until, function(err, tweets) {
							if(err) {

								res.send('Error with get requestss.', 400);
							} else {
							
								db.getRetrieveTweets(tweets,sinceHour,untilHour,rangeType,function(err,docs){
								
									proc.mentionsProc(docs,0,function(outPut,extra){
										
										docs["mentions"]=formatOutput(outPut,extra,tweets);
											
										entityModel.metricsProc(entities.account.screen_name,docs,function(outPut,extra){
						
											entities.account.authotingLevel=extra.authotingLevel
											entities.account.ga=entities.account.statuses_count;
											entities.account.info=docs["mentions"]["info"];
											entities.account.approval=((docs["mentions"]["info"]["positivo"]-docs["mentions"]["info"]["negativo"])/(docs["mentions"]["info"]["positivo"]+docs["mentions"]["info"]["negativo"]));
											
											console.log(entities.account.approval)
											if(entities.account.approval==NaN)
												entities.account.approval=0;
										
										callback(null,entities)
										//return o;	
										});
										
									});	
								})
							}
						});
					
				}
			});
});
}



/*
	validateInput
	=============
	Valida que los parámetros suministrados son correctos.
*/
function validateInput(req, callback) {
	// req.checkParams('observatoryID', 'Invalid ID').isInt();
	req.checkQuery('since', 'Invalid since date').isDate();
	req.checkQuery('until', 'Invalid until date').isDate();
	req.checkQuery('until', 'Please supply an until date that is after the given since date')
					.isAfter(req.query.since);
	var errors = req.validationErrors();
	callback(errors);
};
module.exports = router;
