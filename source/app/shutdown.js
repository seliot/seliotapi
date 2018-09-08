'use strict';

const Mongoose = require('mongoose');

const gracefulShutdown = async (server) => {

	server.log(['Error', 'Shutdown'], `SIGTERM and SIGINT received.`);

	try {
		const db = await Mongoose.connection.close();
		server.log(['info'], `Connection to mongodb closed`);
	} catch(Exceptions) {
		server.log(['error'], `Exception while closing the mongo connections`);
	}

	server.jobs && server.jobs.stop(() => {
		server.log(['Error', 'Shutdown'], `Shutting down jobs.`);
		process.exit(0);
	});

	// process.exit(0);
};

module.exports = {
	name : 'shutdown-plugin',
	version : '1.0.0',
	register: function(server, options) {
		process.on('SIGTERM', _.bind(gracefulShutdown, null, server));
		process.on('SIGINT', _.bind(gracefulShutdown, null, server));
	}
}
