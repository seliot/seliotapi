'use strict';

const Sequelize = require('sequelize');
const fileHandler = require('s3-storage');

const auditmanagementdb = {
  host: 'btc-audit-management.c1oxjo0vqufc.ap-south-1.rds.amazonaws.com',
  database: 'auditmanagement',
  username: 'root',
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
  env: 'test',

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
    auditmanagement: auditmanagementdb
  },

  s3Handler : fileHandler('co.selenite.bankers-suit.audit.test', {
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
      },
      {
        plugin: require('hapi-sequelizejs'),
        options: [
          {
            name: 'auditdb',                                            // identifier
            models: ['./storage/audit-management/models/**/*.js'],      // paths/globs to model files
            sequelize: new Sequelize(auditmanagementdb),                // sequelize instance
            sync: true,                                                 // sync models - default false
            forceSync: false                                            // force sync (drops tables) - default false
          }
        ]
      }, {
        plugin: require('../app/developerauth')
      },
      {
        plugin: require('../app/api'),
        routes: {
          prefix: '/api/v1'
        }
      }
    ]
  }
};
