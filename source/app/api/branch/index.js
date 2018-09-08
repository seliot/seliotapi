'use strict';

const Methods = require('./methods');
const Validations = require('./validations');

exports.routes = [
  {
    method: 'GET',
    path: '/branch',
    options: {
      validate: Validations.fetchBranch,
      tags: [
        'api', 'Branch'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchBranch(request, h)
    }
  },
];
