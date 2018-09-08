'use strict';

module.exports = {
    name : 'auth-plugin',
    version : '1.0.0',
    register : function(server, options) {
        server.auth.strategy('keycloak-jwt', 'keycloak-jwt');
    }
}