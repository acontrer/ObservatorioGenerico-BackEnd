var express = require('express');
var app = express();
var path = require('path');
var moment=require('moment');
var bodyParser = require('body-parser');
var http = require('http');
var service= require('./routes/service');
var observatory= require('./routes/observatory');
var queries= require('./routes/query');
var entity= require('./routes/entity');
var user= require('./routes/user');
var source = require('./routes/source');



	app.use(bodyParser());
	app.use(express.static('xporter/out'));
	app.use('/',service);
	app.use('/observatory',observatory);
	app.use('/queries',queries);
	app.use('/entity',entity);
	app.use('/user',user);
  app.use('/source',source);
	app.use(express.static(path.join(__dirname, 'public')));

	http.createServer(app).listen(22222, function(){
	  console.log('hello world!');
	});

readInput=function(req,callback){
	// function readInput(req, callback) {

		id	=	 req.params.observatoryID,
		userName	=	 req.params.userName,
		query	=	 req.query.query,
		since	=	 new Date(req.query.since),
		until	=	 new Date(req.query.until),
		sinceHou	=	req.query.sincehour,
		untilHou	=	req.query.untilhour,
		rangeTyp	=	req.query.rangetype,
		type	=	 req.query.type,
		entity	=	 req.query.entity,
		k	=	 req.query.k;

		services = req.query.services;

		if(services!=undefined)
			services = req.query.services.split("-");
		else
			services=["geo","timeSerie","donut","document","topWords","media","url","geo2"];

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
console.log("test")
