'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  fetchUsers: {
    failAction: function (request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      id: Joi.string().guid({ version: ['uuidv1']})
    }
  },
};
