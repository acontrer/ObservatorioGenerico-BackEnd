var app = require('express');
var router = app.Router();
var moment = require('moment');
var db = require('../Dao/db');
var entityModel = require('../Dao/entity.js');

router.get('/:observatoryID/:userName/type/:typestr', function(req,res) {

	readInput(req,function(){
		console.log(id)

		entityModel.getTypeEntities(id,req.params.userName,req.params.typestr,function(err, observatories) {

			if(err) {

				res.send(err, 400);

			} else {

				res.send(observatories, 200);

			}
		})


	});
});
router.get('/:observatoryID/:userName/:consultaID', function(req,res) {

	readInput(req,function(){


		entityModel.getEntities(id,req.params.userName,req.params.consultaID,function(err, observatories) {
			console.log(observatories)
			if(err) {

				res.send(err, 400);

			} else {

				res.send(observatories, 200);

			}
		})


	});
});

/*
AGREGA ENTIDADES AL OBSERVATORIO DEFINIDO
*/
router.post('/:observatoryID/:userName/:consultaID', function(req,res) {

	var entities=req.body.entities;

	if (entities==null) {

		entities=[]

	}

	readInput(req,function(){

		db.getObs(id,userName, function(err, observatories) {

			if(err) {

				res.send(err, 400);

			} else {

					for(w=0;w<entities.length;w++){

                        var AR = Math.random()
                        AR *= Math.floor(Math.random()*2) == 1 ? 1 : -1
                        stats =  {
	                        "approval" : {
	                            "approvalRank" : AR,
	                            "timestamp" : new Date()
	                        },
	                        "activity" : {
	                            "topicalSignal" : Math.random(),
	                            "signalStrength" : Math.random()
	                        },
	                        "popularity" : {
	                            "followerRank" : Math.random(),
	                            "popularity" : Math.random(),
	                            "aScore" : Math.random(),
	                            "aaScore" : Math.random()
	                        },
	                        "influence" : {
	                            "retweetImpact" : Math.random(),
	                            "mentionImpact" : Math.random(),
	                            "socialNetworkingPotential" : Math.random(),
	                            "velocity" : Math.random()
	                        },
	                        "timestamp" : new Date()
	                    }


						entities[w]["observatory"]=req.params.observatoryID;
						entities[w]["consulta"]=req.params.consultaID;
                        entities[w]["metrics2"] = stats;

                        if (entities[w]["id"]==null) {

                        	entityModel.addEntity(id,entities[w],function(err,item){

							});

                        }
                        else {
	                        var entityId = entities[w]["id"]

	                        delete(entities[w]["id"])

	                        entityModel.updateEntity(id,entityId,entities[w],function(err,item){
                        	});

                        }
					}
				// }
				res.send("ok",200)

			}
		})


	});
});

router.delete('/:entity', function(req,res) {
		console.log("ROUTERS")
	entityModel.removeEntity(req.params.entity, function(err, response) {

		if(err) {

			res.send(err, 400);
		} else {

			res.send(response,200)

		}
	})


});

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

module.exports = router;
