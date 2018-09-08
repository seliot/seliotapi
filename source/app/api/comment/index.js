'use strict';

const Methods = require('./methods');
const Validations = require('./validations');

exports.routes = [
  {
    method: 'POST',
    path: '/comment',
    options: {
      validate: Validations.createComment,
      tags: [
        'api', 'Comment'
      ],
      auth: false,
      handler: (req, h) => Methods.createComment(req, h)
    }
  },
  {
    method: 'GET',
    path: '/comment',
    options: {
      validate: Validations.fetchComment,
      tags: [
        'api', 'Comment'
      ],
      auth: false,
      handler: (req, h) => Methods.fetchComment(req, h)
    }
  }
];
