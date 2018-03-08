var app = require('express');
var router = app.Router();
var observatory = require('../Dao/observatory');
var moment = require('moment');
var db = require('../Dao/db');
var queriesM = require('../Dao/queries');
var entityM = require('../Dao/entity.js');
var unirest = require('unirest');
var zipFolder = require('zip-folder');
var config=require('../config.js');
	var xPor=require('../xporter/createxls.js');
router.get('/:observatoryID/:userName', function(req,res) {
		
	readInput(req,function(){
		
		queriesM.getQueries(id, req.params.userName, function(err, observatories) {
	
			if(err) {
	
				res.send(err, 400);	
			} else {
					//res.header('Access-Control-Allow-Origin', "*"); 
					res.send(observatories, 200);
			
			}
		})
	

	});

});

router.get('/:observatoryID/:userName/:queryID', function(req,res) {
		
	readInput(req,function(){
		
		queriesM.getQuery(id, req.params.queryID,req.params.userName,function(err, queryR) {
	
			if(err) {
	
				res.send(err, 400);	
			} else {
					//res.header('Access-Control-Allow-Origin', "*"); 
					res.send(queryR, 200);
			
			}
		})
	

	});
});


router.get('/',function(req, res) {
		
		xporter.setObservatory();

});	

function zipIt(consultaID,userName,observatoryID){
	zipFolder('tmpFiles/'+consultaID, 'public/'+consultaID+".zip", function(err) {

	if(err) {
	    console.log('oh no!', err);
	} else {
	    console.log('EXCELLENT');
	    var objectUpdate= new Object()
	
	    objectUpdate.xls=consultaID+".zip";
	
		db.getObs(observatoryID,userName,function(err, observatory) {
	
		    queriesM.updateQuery(observatoryID,consultaID,objectUpdate,function(err,item){
			
			console.log("====================s")	
			console.log(err)
		})
		})
    }
	});
}

function nextBolsa(xporter,i,callback){

	if(i<0){
	
		callback()
	}else{
	
		xporter.procesarBolsa(i,function(){
	
			nextBolsa(xporter,i-1,callback)
	
		});
	}
}

function exportXls(consultaID,userName,observatoryID){
	

	
	this.xporter=new xPor.xporter()

	this.xporter.setFolder("tmpFiles/"+consultaID+"/");

	this.xporter.setObservatory(observatoryID);

	this.xporter.setConsulta(consultaID);

	this.xporter.setUser(userName);
	


	this.xporter.initXls(function(bagOfWords,total){

		this.xporter.setBagOfWords(bagOfWords)

		nextBolsa(this.xporter,total-1,function(){

			zipIt(consultaID,userName,observatoryID)

		});	
	});
}


router.get('/export/:id/:consultaID/:userName',function(req, res) {
			
			
	exportXls(req.params.consultaID,req.params.userName,req.params.id)

	res.send(200)
		
});

router.get('/bubble/:observatoryID/:consultaID/:userName', function(req, res) {
 
 readInput(req,function(){

		db.getObs(id,userName,function(err, observatory) {
			// console.log(observatories)
		queriesM.getQuery(id,req.params.consultaID,req.params.userName, function(err, query) {
	
		entityM.getEntities(id,req.params.consultaID,function(err, entities) {
				// console.log(query)
			var bagOfTopics=new Object();
			bagOfTopics.topics=new Array();
			bagOfTopics.id=new Date().getTime()
			
			objectUpdate= new Object()
			objectUpdate.simulation_id=bagOfTopics.id;

			queriesM.updateQuery(id,req.params.consultaID,objectUpdate,function(err,item){
				
				console.log("====================s")	
				console.log(item)
			})

			bagOfTopics.dateInit=query[0]["date"].split(" - ")[0]
			bagOfTopics.dateEnd=query[0]["date"].split(" - ")[1]

			if(observatory.source!=undefined)
				bagOfTopics.sources=observatory.source.join(",")
			bagOfTopics.user=observatory.user
	
			for(i=0;i<entities.length;i++){

				var topics=new Object()
				topics.name=entities[i]['name']
				topics.terms=new Array()
				
				for(j=0;j<entities[i]['terms'].length;j++)
					topics.terms.push(entities[i]['terms'][j]["w"])
				// console.log(topics)
				bagOfTopics.topics.push(topics)
			}
	
			
			if(err) {
			
				res.send(err, 400);	

			} else {
						console.log(bagOfTopics)
				unirest.post(config.simulationHost+":9999/run")
				.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
				.send(bagOfTopics)
				.end(function(response){
					console.log(response.body)
					res.send("ok", 200);

				});

				
			
			}
				})
				
			});
	})

	});
});


/*
AGREGA ENTIDADES AL OBSERVATORIO DEFINIDO
*/
router.post('/:observatoryID/:userName/:consultaID', function(req,res) {
    		
	readInput(req,function(){
	
		db.getObs(id,userName, function(err, observatories) {
			console.log("x========================================XX")
				console.log("x========================================XX")
			console.log("x========================================XX")
			
			if(err) {
	
				res.send(err, 400);	
			} else {

			req.body.user = userName
			if (req.body.mongoID.length==0) {
				queriesM.addQueries(id,req.body,function(err,item){
					// exportXls(req.params.consultaID,req.params.userName,req.params.observatoryID)
				}); 
			}
			else {
				
				queriesM.updateQueryByMongoId(req.body.mongoID,req.body,function(err,item){
					// exportXls(req.params.consultaID,req.params.userName,req.params.observatoryID)
				}); 
                                }
				res.send("ok",200)
			
			}


		})
	

	});
});	

router.delete('/:observatoryID/:userName/:consultaId', function(req, res) {
		             
    	queriesM.removeQuery(req.params.observatoryID,req.params.consultaId,req.params.userName, function(err, response) {
                     if(err) {

                        res.send(err, 400);	
                    } else {

						                    
                	entityM.removeQueryEntities(req.params.observatoryID,req.params.consultaId,req.params.userName, function(err, response) {
                   
                            if(err) {

                                res.send(err, 400);	
                            } else {

                                res.send(response,200)

                            }
                    })

                        //res.send(response,200)

                    }
            })
		
					
});

module.exports = router;
