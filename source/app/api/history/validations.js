const Boom = require('boom');
const Joi = require('joi');
module.exports = {

  getHistoryList: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: Joi.object().keys({
      objectId: Joi.string().required()
    }),
    query: Joi.object().keys({
      objectType: Joi.string().only('Audit', 'Objection').required(),
      key: Joi.array().items(Joi.string()).single(),
      order: Joi.object().keys({
        createdAt: Joi.number().integer().default(-1).valid(-1,1)
      }).default({createdAt: -1}),
      pageNo: Joi.number().integer().default(1),
      pageSize: Joi.number().integer().default(10)
    })
  },
  getHistoryCount: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: Joi.object().keys({
      objectId: Joi.string().guid({ version: ['uuidv1']}).required(),
    }),
    query: Joi.object().keys({
      objectType: Joi.string().only('Audit', 'Objection').required(),
      key: Joi.array().items(Joi.string()).single(),
    })
  }

};
