var app = require('express');
var router = app.Router();
var source = require('../Dao/source');

router.get('/', function(req,res) {
		
	readInput(req,function(){
		
		source.getSources(function(err, observatories) {
	
			if(err) {
	
				res.send(err, 400);	
			} else {
					//res.header('Access-Control-Allow-Origin', "*"); 
					res.send(observatories, 200);
			
			}
		})
	

	});

});

module.exports = router;
