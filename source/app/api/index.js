'use strict';

const Glob = require('glob');

module.exports = {
	name: 'api-plugin',
    version: '1.0.0',
    register: function (server, options) {
        server.log(['info'], `Registering API Plugin`);
        var modules = Glob.sync(__dirname + '/*/index.js');
        modules.forEach(function(module) {
	        server.route(require(module).routes);
        });
    }
}
