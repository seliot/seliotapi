'use strict';

module.exports = {
    name : 'auth-silo-plugin',
    version : '1.0.0',
    register : function(server, options) {
        const validate = async function(request, decoded, h) {
            const config = require('../config').siloadmin;
        	if (!(decoded.id && decoded.source && decoded.source === 'silo' && decoded.id === config.email)) {
	          return { isValid: false, credentials: decoded };
	        }
	        return { isValid: true, credentials: decoded };
        };

        server.auth.strategy('silo', 'jwt', {
            allowQueryToken : true,
            key : options.secret,
            validate : validate,
            verifyOptions : { algorithms : [options.algo] }
        });
    }
}