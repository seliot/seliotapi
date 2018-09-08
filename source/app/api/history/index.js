'use strict';
const Methods = require('./methods');
const Validations = require('./validations');
exports.routes = [

  {
    method: 'GET',
    path: '/history/{objectId}',
    options: {
      validate: Validations.getHistoryList,
      tags: [
        'api', 'History'
      ],
      auth: false,
      description: 'Get histories of specific object',
      handler: (req, h) => Methods.getHistoryList(req, h)
    }
  },
  {
    method: 'GET',
    path: '/history/{objectId}/count',
    options: {
      validate: Validations.getHistoryCount,
      tags: [
        'api', 'History'
      ],
      auth: false,
      description: 'Get histories count',
      handler: (req, h) => Methods.getHistoryCount(req, h)
    }
  }
];
