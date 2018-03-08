var app = require('express');
var router = app.Router();
var observatory = require('../Dao/observatory');
var moment = require('moment');
var db = require('../Dao/db');
var entityM = require('../Dao/entity');
var unirest = require('unirest');
var queryM = require('../Dao/queries')

router.post('/', function(req, res) {
                console.log("TEST!")
		observatory.create(req.body, function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.', 400);
			
			} else {
				
				var out= new Object();

				res.header('Access-Control-Allow-Origin', "*"); 

				res.send(true, 200);
			}

		});
});


router.delete('/:observatoryID/:userName', function(req, res) {

		observatory.delete(req.params.observatoryID,req.params.userName, function(err, results) {
			
			if(err) {
				
				res.send('Error with get request.', 400);
			
			} else {
				
				var out= new Object();

				if(results!=null){

					//res.header('Access-Control-Allow-Origin', "*"); 
                                               
                	queryM.removeObservatoryQueries(req.params.observatoryID,req.params.userName, function(err, response) {
                   
                            if(err) {

                                res.send(err, 400);	
                            } else {
	

									entityM.removeObservatoryEntities(req.params.observatoryID,req.params.userName, function(err, response) {
								   
											if(err) {

												res.send(err, 400);	
											} else {

												res.send(response,200)
											}                            
									})






                                //res.send(response,200)

                            }
                    })
                            
                            
                            
                                        

                    
					//res.send(true, 200);
					}
				else{
					res.send('Error with get request.', 400);
				}
		
			}

		});
});

router.get('/:userName',function(req, res) {

		readInput(req,function(){	

			db.getObservatories(userName, function(err, observatories) {
			
				if(err) {
		
					res.send('Error with get request.', 400);
		
				} else {
				
					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(observatories, 200);
				}
			});


								
		})
		
});

router.get('/:observatoryID/:userName',function(req, res) {
 
 		readInput(req,function(){

			db.getObs(id,userName,function(err, observatories) {
	                        console.log(id)	
				if(err) {
		
					res.send('Error with get request.', 400);
		
				} else {
				
					res.header('Access-Control-Allow-Origin', "*"); 

					res.send(observatories, 200);
				}
			})
								
		})
		
});


module.exports = router;
