'use strict';

const Joi = require('joi');

module.exports = {

  createAudit: {
    failAction: function (request, h, source, error) {
      return Boom.badRequest(source.details[0].message);
    },
    payload: {
      
    }
  },

}