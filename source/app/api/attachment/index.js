'use strict';

const Methods = require('./methods');
const Validations = require('./validations');
exports.routes = [
  {
    method: 'POST',
    path: '/attachment',
    options: {
      validate: Validations.uploadAttachment,
      tags: [
        'api', 'Attachment'
      ],
      auth: false,
      handler: (request, h) => Methods.uploadAttachment(request, h),
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      }
    }
  },
  {
    method: 'GET',
    path: '/attachment/{id}',
    options: {
      validate: Validations.downloadAttachment,
      tags: [
        'api', 'Attachment'
      ],
      auth: false,
      handler: (request, h) => Methods.downloadAttachment(request, h)
    }
  },
  {
    method: 'GET',
    path: '/attachment',
    options: {
      validate: Validations.fetchAttachments,
      tags: [
        'api', 'Attachment'
      ],
      auth: false,
      handler: (request, h) => Methods.fetchAttachments(request, h)
    }
  },
  {
    method: 'GET',
    path: '/attachment/{id}/downloadable',
    options: {
      validate: Validations.downloadLink,
      tags: [
        'api', 'Attachment'
      ],
      auth: false,
      handler: (request, h) => Methods.downloadLink(request, h)
    }
  }
];
