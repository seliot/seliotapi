'use strict';
const Methods = require('./methods');
const Validations = require('./validations');
exports.routes = [
  {
    method: 'POST',
    path: '/objection',
    options: {
      validate: Validations.createObjection,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Create a new Objection',
      handler: (req, h) => Methods.createObjection(req, h)
    }
  },

  {
    method: 'GET',
    path: '/objection',
    options: {
      validate: Validations.getObjection,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Get Objection List',
      handler: (req, h) => Methods.getObjection(req, h)
    }
  },
  {
    method: 'GET',
    path: '/objection/count',
    options: {
      validate: Validations.fetchObjectionsCount,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchObjectionsCount(request, h)
    }
  },
  {
    method: 'GET',
    path: '/objectionDetail/{id}',
    options: {
      validate: Validations.getObjectionDetail,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Get Objection List',
      handler: (req, h) => Methods.getObjectionDetail(req, h)
    }
  },
  {
    method: 'DELETE',
    path: '/objection/{id}',
    options: {
      validate: Validations.deleteObjection,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Delete a selected objection',
      handler: (req, h) => Methods.deleteObjection(req, h)
    }
  },
  {
    method: 'PUT',
    path: '/objection/{id}',
    options: {
      validate: Validations.updateObjection,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Update a specific objection',
      handler: (req, h) => Methods.updateObjection(req, h)
    }
  },
  {
    method: 'PUT',
    path: '/objection/{id}/change-status',
    options: {
      validate: Validations.updateObjectionStatus,
      tags: [
        'api', 'Objection'
      ],
      auth: false,
      description: 'Update a specific objections status',
      handler: (req, h) => Methods.updateObjectionStatus(req, h)
    }
  }
];
