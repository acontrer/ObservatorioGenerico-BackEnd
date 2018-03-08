var app = require('express');
var router = app.Router();
var user = require('../Dao/user');
var observatoryR = require('../Dao/observatory')
var entityR = require('../Dao/entity')
var queryR = require('../Dao/queries')

router.post('/', function(req, res) {
                console.log(req.body.name)
                if (req.body.newPassword==null) {
          	user.addUser(req.body.username,req.body.password, req.body.email, function(err, results) {
			if(err) {
				console.log("ERROR!!:"+err)
				res.send(String(err.code), 400);
			
			} else {
				
				var out= new Object();

				res.header('Access-Control-Allow-Origin', "*"); 

				res.send(true, 200);
			}

		});
                } else

                {
                console.log("newPass")
                user.updatePassword(req.body.username,req.body.password,req.body.newPassword,function(err,results) {
                        console.log("results: ",results)
                        if(err) {
                                res.send(String(err.code),400);
                        }
                        else {
                                res.send(results,200)
                        }
                        
                })
                }
});


router.delete('/:userName/:password', function(req, res) {
                console.log(req.params.userName)
                console.log(req.params.password)              
		user.delete(req.params.userName,req.params.password, function(err, results) {
			if(err) {
				
				res.send('Error with delete request.', 400);
			
			} else if (results.deletedCount==0) {
                                res.send(results.deletedCount,400)

                        }
                         else        {
				
				var out= new Object();

				if(results!=null){
                                                observatoryR.removeUserObservatories( req.params.userName, function(err,response) {
                                                 if(err) {

	                                                       res.send(err, 400);	
                                                        } else {
                                                                if (results!=null)  
                                                                {         


                                                                       queryR.removeUserQueries(req.params.userName, function(err,response) {
                                                                                if (err) {
                                                                                        res.send(err,400)

                                                                                }
                                                                                else {
																												   
																						   entityR.removeUserEntities(req.params.userName, function(err,response) {
																									if (err) {
																											res.send(err,400)

																									}
																									else {
																													console.log("RESPONSE:"+results)
																												res.send(results,200)
																									} 
																									/*                                                                                
																									else {
							
																									}
																									*/

																							})                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                                console.log("RESPONSE:"+results)
	                                                                                       // res.send(results,200)
                                                                                } 
                                                                                /*                                                                                
                                                                                else {
        
                                                                                }
                                                                                */

                                                                        }) 


  
                                                                
                                                                } 
                                                               

                                                        }

                                                })
					res.header('Access-Control-Allow-Origin', "*"); 
                                                /*
                                        	entityM.removeObservatoryEntities(req.params.observatoryID,req.params.userName, function(err, response) {
			                               console.log("HOLA")
                                                        if(err) {

	                                                       res.send(err, 400);	
                                                        } else {

	                                                       res.send(response,200)

                                                        }
                                                })   */
					//res.send(true, 200);
					}
				else{
					res.send('Error with get request.', 400);
				}

			}

		});
});


module.exports = router;
