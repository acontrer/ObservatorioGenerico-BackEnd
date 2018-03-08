var util = require('util');
var moment = require('moment');
var db = require('../db');
var userModel = require('../user');
var entityModel = require('../entity.js');
var observatory = require('../observatory');
var backup = require('../backup.js');
var confModel = require('../conf');
var proc = require('../proc.js');
var proc2 = require('../proc2.js');
var elasticsearch = require('elasticsearch');
var index=require("../index.js")
var metrics = require('../metrics.js');

module.exports = function attachHandlers(router) {
	
	router.post('/test/', metricsOp);

	router.get('/', home);

	router.get('/user/:name', user);

	router.post('/user/', userPost);

	router.post('/observatory/', obsPost);

	

	router.delete('/backup/', backupDelete);

	router.delete('/observatory/:observatoryID', obsDelete);
	/*
	Devuelve la configuracion del sitio por usuario
	**** FIX entrega una configuracion por defecto
	*/
	router.get('/configuration/', configuration);

	

	/*
	Devuelve los tweets usuario e identificador del mensaje
	*/
	// router.get('/data/:observatoryID', getService);
	
	router.get('/service/:observatoryID', getSpecificData);

	router.get('/entities/', getEntity);	

	router.get('/entities/:observatoryID', getEntity);	
	
	router.get('/savedTweets/:observatoryID', getFakeTweets);

	router.get('/topEntities/', topEntities);

	router.get('/observatories',getObservatories);

	router.get('/observatories/:observatoryID',getObservatories);



	//----------------------------  Borrar estas ->

	/*
	Devuelve todos los datos del sitio
	*/
	router.get('/alldata/:observatoryID', getAllData);

	/*
	Devuelve el total de menciones, las positivas y  las negativas
	*/
	// router.get('/mentions/:observatoryID',getService);

	// /*
	// Devuelve las menciones geolocalizadas
	// */
	// router.get('/geo/:observatoryID', getService);

	// router.get('/media/:observatoryID', getService);

	// router.get('/url/:observatoryID', getService);

	// router.get('/news/:observatoryID', getService);

	// router.get('/topWords/:observatoryID', getService);


	// ------------------ <- Borrar
};


function home(req, res) {

	res.sendfile('./index.html');

}

function metricsOp(req, res) {

	metrics.calculateMetrics();

}
function getFakeTweets(req, res)  {

	var salida=new Array();
		

	readInput(req,function(){

				db.getObs(id, function(err, observatories) {
					
				if(err) {
		
					res.send(err, 400);

		
				} else {


				db.getIDs(observatories,query, since, until, function(err, tweets) {
					
					if(err) {
						res.send('Error with get request.', 400);
					} else {
					
						db.getRetrieveTweets(tweets,sinceHour,untilHour,rangeType,function(err,getDocs){
							var docs=new Object();
							docs['docs']=getDocs;
							
							
							if(err)
								console.log(err);
							else	{

								res.header("Content-Type", "application/json; charset=utf-8");
								
								res.header('Access-Control-Allow-Origin', "*"); 

								res.send(docs, 200);

							}


							

						});
					}

				});
			}
		});
	});
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
function backupDelete(req, res) {

	var d=new Date(moment().subtract(1,"days").toISOString());

		
		backup.delete(objectIdFromDate(d), function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.a', 400);
			
			} else {
				
				var out= new Object();

					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(true, 200);
		
			}

		});

}

var objectIdFromDate = function (date) {
	return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

function obsDelete(req, res) {

		observatory.delete(req.params.observatoryID, function(err, results) {
			
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
function obsPost(req, res) {


		observatory.create(req.body, function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.', 400);
			
			} else {
				
				var out= new Object();

				res.header('Access-Control-Allow-Origin', "*"); 

				res.send(true, 200);
			}

		});
}


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

		
		index.search2(id,query,since,until,function(err,docs){
		
			console.log(docs)
		
			res.header("Content-Type", "application/json; charset=utf-8");
						
			res.header('Access-Control-Allow-Origin', "*"); 
			
			res.send(docs, 200);
		})
	})
}
module.exports.search=function(id,query,since,until,callback) {
	
	search(id,query,since,until,callback);

}




 
 
function getObservatories(req, res) {

		readInput(req,function(){

				if(id!=undefined)
					db.getObs(id,function(err, observatories) {
						if(err) {
				
							res.send('Error with get request.', 400);
				
						} else {
						
							res.header('Access-Control-Allow-Origin', "*"); 

							res.send(observatories, 200);
						}
					})
				else
					db.getObservatories( function(err, observatories) {
					
						if(err) {
				
							res.send('Error with get request.', 400);
				
						} else {
						
							res.header('Access-Control-Allow-Origin', "*"); 

							res.send(observatories, 200);
						}
					});
										
				})
		
}

function getTweets(req, res) {

			
	readInput(req,function(){

		db.getObs(id,function(err, observatories) {
			

				
			if(err!=null) {
	
				console.log("err");
	
			} else {
			db.getIDs(id, since, until, function(err, tweets) {
				
				if(err) {
					res.send('Error with get request.', 400);
				} else {
				
					db.getRetrieveTweets(tweets,sinceHour,untilHour,rangeType,function(err,docs){

						proc.dataProc(docs,k,function(results){
							
							var out=new Object();
							out.data=results;
							out.total=tweets.length;

							res.header('Access-Control-Allow-Origin', "*"); 

							res.send(out, 200);

						
						});
					});
				}

			});
		}
	});
	})
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

function getEntity(req,res) {
		
	readInput(req,function(){
	
		
	if(id==undefined)
		db.getObs("politicos", function(err, observatories) {
			
		if(err) {

			res.send(err, 400);


		} else {
			entityModel.getEntities(req,function(err, entities) {
				if(err) {
					
					res.send('Error with get request.', 400);
				} else {
					
				//	accounts(req,entities,0,function(err,out){

						//console.log(out)
						res.header('Access-Control-Allow-Origin', "*"); 
					res.send(entities, 200);
				//	});
					
					
				}
			});
		}
	})
	else
		db.getObs(id, function(err, observatories) {
				
			if(err) {
	
				res.send(err, 400);

	
			} else {
				getAccount(req,entity,function(err,entity){
				//	console.log(entity)
					res.header('Access-Control-Allow-Origin', "*"); 
					res.send(entity, 200);
				})
			
}
})
	

	});
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
function calculateMetrics(req,screen_name,callback){
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

// function getMentions(req, res) {
	
// 	readInput(req,function(){

// 		getProcessedMentions(query, since, until,  function(err, tweets) {
// 			if(err) {
				
// 				res.send('Error with get request.', 400);

// 			} else {
// 				var out=new Object();

// 				out=tweets;

// 				out.total=tweets.length;

// 				res.header('Access-Control-Allow-Origin', "*"); 

// 				res.send(out, 200);
// 			}
// 		});
// 	});
// };

function readInput(req, callback) {
	
	id = req.params.observatoryID
	query = req.query.query,
	since = new Date(req.query.since),
	until = new Date(req.query.until),
	sinceHour=req.query.sincehour,
	untilHour=req.query.untilhour,
	rangeType=req.query.rangetype,
	type = req.query.type,
	entity = req.query.entity,
	k = req.query.k;

	services = req.query.services;

	if(services!=undefined)
		services = req.query.services.split("-");
	else
		services=["geo","timeSerie","donut","document","topWords","media","url"];

	if(since=="Invalid Date")
		since=new Date(moment().subtract('days', 7).toISOString())

	if(until=="Invalid Date")
		until=new Date()

	if(k==undefined)
		k=15;


	if(query!=undefined)
		if(query.length<=1)
			query="GLOBAL";

	callback();
};

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
