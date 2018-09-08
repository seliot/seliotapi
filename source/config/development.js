'use strict';

const Sequelize = require('sequelize');
const fileHandler = require('s3-storage');

const auditmanagementdb = {
  host: '192.168.1.231',
  database: 'auditdb',
  username: 'developer',
  password: 'Selenite#1',
  operatorsAliases: false,
  dialect: 'mysql',
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000
  }
};

module.exports = {
  env: 'development',

  product: {
    name: 'audit-management',
    secret: 'btcauditmanagement'
  },

  session: {
    expiresIn: 60 * 60 * 24 // 24 Hr.
  },

  siloadmin: {
    email: 'admin@selenite.co',
    password: 'Selenite#1',
    secret: 'btcauditmanagement'
  },

  dbdebug: true,

  storage: {
    scrumboard: {
      uri: 'mongodb://mongo:27017/scrumboard',
      options: {
        useMongoClient: true,
        autoIndex: true, // Don't build indexes
        reconnectTries: 10, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        bufferMaxEntries: 0
      }
    },
    auditmanagement: auditmanagementdb
  },

  s3Handler : fileHandler('co.selenite.bankers-suit.audit.dev', {
    type: 's3',
    secretAccessKey: 'MZW99cAEAUOD5mLBPU+sQU8fdDsRUH8Qo6+5/m+v',
    accessKeyId: 'AKIAJ57OY7N6SI3I3JWA',
    region: 'ap-south-1'
  }),

  server: {
    port: 9000,
    compression: {
      minBytes: 1024
    },
    debug: {
      request: ['error'],
      log: ['*']
    },
    load: {
      sampleInterval: 1000
    },
    app: {},
    routes: {
      cors: true
    }
  },
  register: {
    plugins: [
      {
        plugin: 'inert'
      }, {
        plugin: 'hapi-auth-basic'
      }, {
        plugin: 'vision'
      }, {
        plugin: 'hapi-auth-keycloak',
        options: {
          realmUrl: 'http://192.168.1.208:8181/auth/realms/bankers-suite',
          clientId: 'audit-management-api',
          minTimeBetweenJwksRequests: 15,
          cache: true,
          userInfo: ['name', 'email']
        }
      }, {
        plugin: require('../app/auth'),
        options: {
          secret: 'btcauditmanagement',
          algo: ['HS256']
        }
      }, {
        plugin: require('hapi-sequelizejs'),
        options: [
          {
            name: 'auditdb', // identifier
            models: ['./storage/audit-management/models/**/*.js'], // paths/globs to model files
            sequelize: new Sequelize(auditmanagementdb), // sequelize instance
            sync: true, // sync models - default false
            forceSync: false // force sync (drops tables) - default false
          }
        ]
      }, {
        plugin: require('../app/developerauth')
      },
      // {
      //     plugin: require('../app/auth-silo-jwt'),
      //     options: {
      //         secret: 'btcauditmanagement',
      //         algo: ['HS256']
      //     }
      // },
      {
        plugin: 'hapi-swagger',
        options: {
          host: 'localhost:9000',
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
      }, {
        plugin: require('../app/api'),
        routes: {
          prefix: '/api/v1'
        }
      }
    ]
  }
};
