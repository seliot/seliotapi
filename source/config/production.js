'use strict';

module.exports = {
	env: 'production',

	product: {
		name: 'audit-management',
		secret: process.env.PRODUCT_SECRET,
	},

	session: {
		expiresIn: process.env.SESSION_EXPIRY
	},
	
	siloadmin: {
		email: process.env.SILO_EMAIL,
		password: process.env.SILO_PASSWORD,
		secret: process.env.SILO_SECRET
	},

	dbdebug: true,

	storage: {
		scrumboard: {
            uri: process.env.DB_SCRUMBOARD_URL,
            options: {
                useMongoClient: true,
                autoIndex: true, // Don't build indexes
                reconnectTries: 10, // Never stop trying to reconnect
                reconnectInterval: 500, // Reconnect every 500ms
                poolSize: 10, // Maintain up to 10 socket connections
                bufferMaxEntries: 0
            },

        }
	},

	server: {
		port: 9000,
		compression: { minBytes: 1024 },
		debug: false,
		load: {
			sampleInterval: 1000
		},
		app: {},
		routes: {
			files: {
				relativeTo: __dirname + '/../public/dist'
			},
			cors: true
		}
	},

	register: {
		plugins: [
			{
				plugin: 'inert'
			},
			{
				plugin: 'hapi-auth-basic'
			},
			{
				plugin: 'vision'
			},
            {
                plugin: require('../app/auth-jwt')
            },
            {
                plugin: require('../app/developerauth')
            },
            {
                plugin: require('../app/auth'),
                options: {
                    secret: 'selenitescrumboardsecret',
                    algo: ['HS256']
                }
            },
            {
                plugin: require('../app/auth-silo-jwt'),
                options: {
                    secret: process.env.PRODUCT_SECRET,
                    algo: ['HS256']
                }
            },
			{
				plugin: 'hapi-swagger',
				options: {
					host: process.env.SWAGGER_HOST,
					grouping: 'tags',
					documentationPath: '/docs',
					info: {
						title: 'Audit Management Module',
						version: '1.0.0',
						description: 'Audit Management Module is a module in a Banking Suite. It shall help audit department of a bank to report and follow up on the reported issues to get them quicky resolved and tracked.',
						contact: {
							url: 'http://selenite.co',
							email: 'pratik@selenite.co'
						}
					},
					securityDefinitions: {
						'Bearer': {
							'type': 'apiKey',
							'name': 'Authorization',
							'in': 'header',
							'x-keyPrefix': 'Bearer '
						}
					},
					auth: 'developer'
				}
			},
            {
                plugin: require('../app/api'),
                routes: { 
                    prefix: '/api/v1'
                }
            }
		]
	}
}