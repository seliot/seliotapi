const Boom = require('boom');
const Joi = require('joi');
module.exports = {
  createObjection: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    payload: {
      auditId: Joi.string().guid({version: 'UUIDV1'}).required(),
      type: Joi.string().required(),
      title: Joi.string().required().min(3).max(150),
      message: Joi.string().required().min(3).max(1000),
      severity: Joi.string().required().valid('Low','Medium','High'),
      attachments: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single()
    }
  },
  getObjection: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      ids: Joi.array().items(Joi.string().guid({version: 'UUIDV1'})).single(),
      auditIds: Joi.array().items(Joi.string().guid({version: 'UUIDV1'})).single(),
      types: Joi.array().items(Joi.string()).single(),
      status: Joi.array().items(Joi.string().valid('Open','Closed')).single(),
      severity: Joi.array().items(Joi.string().valid('Low','Medium','High')).single(),
      feilds: Joi.array().items(Joi.string()).single(),
      q: Joi.string(),
      order: Joi.object().keys({
        createdAt: Joi.number().integer().default(-1).valid(-1,1)
      }).default({createdAt: -1}),
      pageNo: Joi.number().integer().default(1),
      pageSize: Joi.number().integer().default(10)
    }
  },
  fetchObjectionsCount: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      ids: Joi.array().items(Joi.string().guid({version: 'UUIDV1'})).single(),
      auditIds: Joi.array().items(Joi.string().guid({version: 'UUIDV1'})).single(),
      types: Joi.array().items(Joi.string()).single(),
      status: Joi.array().items(Joi.string().valid('Open','Closed')).single(),
      severity: Joi.array().items(Joi.string().valid('Low','Medium','High')).single(),
      feilds: Joi.array().items(Joi.string()).single(),
      q: Joi.string(),
      createdAt: Joi.number().integer().default(-1).valid(-1,1)
    }
  },
  getObjectionDetail: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({version: 'UUIDV1'}).required()
    }
  },
  updateObjection: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({version: 'UUIDV1'}).required()
    },
    payload: {
      type: Joi.string().valid('IT','HR'),
      title: Joi.string().min(3).max(150),
      message: Joi.string().min(3).max(1000),
      severity: Joi.string().valid('Low','Medium','High').default('Medium'),
    }
  },
  updateObjectionStatus: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({version: 'UUIDV1'}).required()
    },
    payload: {
      status: Joi.string().valid('Open','Closed').required(),
      closeRemark: Joi.string().min(3).max(150),

    }
  },
  deleteObjection: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().required()
    }
  }

};
