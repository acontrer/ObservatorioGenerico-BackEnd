
exports.attachHandlers = function attachHandlers(server) {
	require('./services.js')(server);
};
