'use strict';

const Joi = require('joi');
const Boom = require('boom');
module.exports = {

  createAudit: {
    failAction: function (request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    payload: {
      branches: Joi.array().items(Joi.string().guid({version: 'UUIDV1'})).single().required(),
      type: Joi.string().valid('Internal','C&C','Statutary','Nabard','Cooperative').required().default('Internal'),
      auditPeriodStartDate: Joi.date().required(),
      auditPeriodEndDate: Joi.date().min(Joi.ref('auditPeriodStartDate')).required(),
      auditReportTargetDate: Joi.date().min(Joi.ref('auditPeriodEndDate')).required(),
      auditorFirmId: Joi.string().guid({version: 'UUIDV1'}).required(),
      coordinatorId: Joi.string().guid({version: 'UUIDV1'}).required()
    }
  },
  fetchAudits: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      ids: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      branches: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      type: Joi.array().items(Joi.string().valid(['Internal', 'C&C', 'Statutary', 'Nabard', 'Cooperative'])).single(),
      status: Joi.array().items(Joi.string().valid(['Open', 'Accepted', 'Rejected', 'Closed', 'Submitted'])).single(),
      auditorFirmIds: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      fields: Joi.array().items(Joi.string()).single(),
      order: Joi.object().keys({
        createdAt: Joi.number().integer().default(-1).valid(-1,1),
        auditReportTargetDate: Joi.number().integer().valid(-1,1)
      }).default({createdAt: -1}),
      pageNo: Joi.number().integer().default(1),
      pageSize: Joi.number().integer().default(10)
    }
  },
  fetchAuditsCount: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    query: {
      ids: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      branches: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      type: Joi.array().items(Joi.string().valid(['Internal', 'C&C', 'Statutary', 'Nabard', 'Cooperative'])).single(),
      status: Joi.array().items(Joi.string().valid(['Open', 'Accepted', 'Rejected', 'Closed', 'Submitted'])).single(),
      auditorFirmIds: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single(),
      fields: Joi.array().items(Joi.string()).single(),
      createdAt: Joi.number().integer().default(-1).valid(-1,1),
      auditReportTargetDate: Joi.number().integer().valid(-1,1),
    }
  },
  fetchAudit: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({ version: ['uuidv1']}).required()
    }
  },
  deleteAudit: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({version: ['uuidv1']}).required()
    }
  },
  updateAudit: {
    failAction: function(request, h, source){
      return Boom.badRequest(source.details[0].message);
    },
    params:{
      id: Joi.string().guid({version: ['uuidv1']}).required()
    },
    payload: {
      branchId: Joi.string().guid({version: ['uuidv1']}),
      type: Joi.string().valid('Internal', 'C&C', 'Statutary', 'Nabard', 'Cooperative'),
      auditPeriodStartDate: Joi.date(),
      auditPeriodEndDate: Joi.date(),
      auditReportTargetDate: Joi.date(),
      auditorFirmId: Joi.string().guid({version: ['uuidv1']}),
      coordinatorId: Joi.string().guid({version: ['uuidv1']})
    }
  },
  updateAuditStatus: {
    failAction: function(request, h, source) {
      return Boom.badRequest(source.details[0].message);
    },
    params: {
      id: Joi.string().guid({version: ['uuidv1']}).required()
    },
    payload: {
      status: Joi.string().required().valid('Open','Accepted','Rejected','Closed','Submitted'),
      remark: Joi.string().min(3).max(1000),
      auditPeriodBranchManager: Joi.string().guid({version: ['uuidv1']}),
      assessmentPeriodBranchManager: Joi.string().guid({version: ['uuidv1']}),
      assessmentPeriodStartDate: Joi.date(),
      assessmentPeriodEndDate: Joi.date(),
      attachments: Joi.array().items(Joi.string().guid({ version: ['uuidv1']})).single()
    }
  }
};
