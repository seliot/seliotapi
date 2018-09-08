'use strict';

const Methods = require('./methods');
const Validations = require('./validations');

exports.routes = [
  {
    method: 'POST',
    path: '/audit',
    options: {
      validate: Validations.createAudit,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      description: 'Create a new Audit',
      handler: (req, h) => Methods.createAudit(req, h)
    }
  },
  {
    method: 'GET',
    path: '/audit',
    options: {
      validate: Validations.fetchAudits,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchAudits(request, h)
    }
  },
  {
    method: 'GET',
    path: '/audit/count',
    options: {
      validate: Validations.fetchAuditsCount,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchAuditsCount(request, h)
    }
  },
  {
    method: 'GET',
    path: '/audit/{id}',
    options: {
      validate: Validations.fetchAudit,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchAudit(request, h)
    }
  },
  {
    method: 'DELETE',
    path: '/audit/{id}',
    options: {
      validate: Validations.deleteAudit,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      handler: (request, h) => Methods.deleteAudit(request, h)

    }
  },
  {
    method: 'PUT',
    path: '/audit/{id}',
    options: {
      validate: Validations.updateAudit,
      tags: [
        'api', 'Audit'
      ],
      auth:false,
      handler: (request ,h) => Methods.updateAudit(request,h)
    }
  },
  {
    method: 'PUT',
    path: '/audit/{id}/change-status',
    options: {
      validate: Validations.updateAuditStatus,
      tags: [
        'api', 'Audit'
      ],
      auth: false,
      description: ' Update a specific audit status',
      handler: (req, h) => Methods.updateAuditStatus(req, h)
    }
  }
];
