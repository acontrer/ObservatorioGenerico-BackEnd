var express = require('express'),
	expressValidator = require('express-validator'),
	bodyParser = require('body-parser'),
	routes = require ('./routes');


exports.createServer = function createServer() {
	var server = express();
	server.use(expressValidator());
	server.use(bodyParser());
	//server.attachHandlers(entity );
	routes.attachHandlers(server);
	return server;
}
