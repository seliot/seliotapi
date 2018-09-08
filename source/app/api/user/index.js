'use strict';

const Methods = require('./methods');
const Validations = require('./validations');
exports.routes = [
  {
    method: 'GET',
    path: '/user',
    options: {
      validate: Validations.fetchUsers,
      tags: [
        'api', 'User'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchUsers(request, h)
    }
  }
];
