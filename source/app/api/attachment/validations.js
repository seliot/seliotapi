'use strict';

const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  uploadAttachment: {
    failAction: function (request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    payload: {
      file: Joi.any().required(),
      objType: Joi.string().valid('Comment', 'Objection', 'Audit').required(),
      type: Joi.string()
    }
  },
  downloadAttachment: {
    failAction: function(request, h, source){
      return Boom.badRequest(source.details[0].message);
    },
    params: Joi.object().keys({
      id: Joi.string().guid({ version: ['uuidv1']}).required()
    }),
    query: Joi.object().keys({
      token: Joi.string().required(),
      disposition: Joi.string().valid('attachment', 'inline').default('attachment')
    })
  },
  fetchAttachments: {
    failAction: function(request, h, source){
      return Boom.badRequest(source.details[0].message);
    },
    query: Joi.object().keys({
      objId: Joi.string().guid({ version: ['uuidv1']}).required(),
      types: Joi.array().items(Joi.string()).single(),
      order: Joi.object().keys({
        createdAt: Joi.number().integer().default(-1).valid(-1,1)
      }),
      pageNo: Joi.number().integer().default(1),
      pageSize: Joi.number().integer().default(10)
    })
  },
  downloadLink: {
    failAction: function(request, h, source){
      return Boom.badRequest(source.details[0].message);
    },
    params: Joi.object().keys({
      id: Joi.string().guid({ version: ['uuidv1']}).required(),
    })
  }
};
