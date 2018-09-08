'use strict';

const Joi = require('joi');
const Boom = require('boom');
module.exports = {
  createComment: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    payload: {
      objectionId: Joi.string().guid({ version: ['uuidv1']}).required(),
      message: Joi.string().min(3).max(1000).required(),
      attachments: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single()
    }
  },
  fetchComment: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      ids: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      objectionId: Joi.string().guid({ version: ['uuidv1']}),
      q: Joi.string(),
      fields: Joi.array().items(Joi.string()).single(),
      order: Joi.object().keys({
        createdAt: Joi.number().integer().default(-1).valid(-1,1)
      }).default({createdAt: -1}),
      pageNo: Joi.number().integer().default(1),
      pageSize: Joi.number().integer().default(10)
    }
  }
};
