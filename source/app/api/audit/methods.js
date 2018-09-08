'use strict';

const Boom = require('boom');
const Transaction = require('../../utils/transaction');

const createAudit = async (req) => {
  try{
    const db = req.getDb('auditdb');
    let  invalidBranchId = [];
    let audits = [];
    for (var i = 0; i < req.payload.branches.length; i++) {
      const result = await db.getModel('Branch').findById(req.payload.branches[i]);
      if(!result){
        invalidBranchId.push(req.payload.branches[i]);
      }
      else{
        const audit = {
          branchId: req.payload.branches[i],
          type: req.payload.type,
          auditPeriodStartDate: req.payload.auditPeriodStartDate,
          auditPeriodEndDate: req.payload.auditPeriodEndDate,
          auditReportTargetDate: req.payload.auditReportTargetDate,
          auditorFirmId: req.payload.auditorFirmId,
          coordinatorId: req.payload.coordinatorId
        };
        audits.push(audit);
      }
    }
    if(!invalidBranchId.length){
      audits.map((audit) => {
        db.getModel('Audit').create(audit);
      });
      return 'Success';
    }
    else {
      return Boom.expectationFailed('Branch Not Found');
    }
  }
  catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
const fetchAudits = async function fetchAudits(req){
  try {
    let limit = req.query.pageSize * 1;
    let offset = limit * (req.query.pageNo - 1);
    const db = req.getDb('auditdb');
    const condition = {};
    if(req.query.ids){
      condition.id = req.query.ids;
    }
    if(req.query.type){
      condition.type = req.query.type;
    }
    if(req.query.branches){
      condition.branchId = req.query.branches;
    }
    if(req.query.status){
      condition.status = req.query.status;
    }
    if(req.query.auditorFirmIds){
      condition.auditorFirmId = req.query.auditorFirmIds;
    }
    if(req.query.fields){
      condition.field = req.query.fields;
    }

    let sort = [];
    if(req.query.order.createdAt === -1){
      sort = [
        ['createdAt', 'DESC']
      ];
    }
    if(req.query.order.createdAt === 1){
      sort = [
        ['createdAt', 'ASC']
      ];
    }
    const audits = await db.getModel('Audit').findAll({
      where: condition,
      limit: limit,
      offset: offset,
      order: sort
    });
    return audits;

  }
  catch(e) {
    return Boom.expectationFailed(e.message);
  }

};

const fetchAuditsCount = async function fetchAuditsCount(req){
  try {
    const db = req.getDb('auditdb');
    const condition = {};
    if(req.query.ids){
      condition.id = req.query.ids;
    }
    if(req.query.type){
      condition.type = req.query.type;
    }
    if(req.query.branches){
      condition.branchId = req.query.branches;
    }
    if(req.query.status){
      condition.status = req.query.status;
    }
    if(req.query.auditorFirmIds){
      condition.auditorFirmId = req.query.auditorFirmIds;
    }
    if(req.query.fields){
      condition.field = req.query.fields;
    }
    if(req.query.auditReportTargetDate){
      condition.auditReportTargetDate = req.query.auditReportTargetDate;
    }
    const audits = await db.getModel('Audit').findAndCountAll({ where: condition });
    return audits.count;

  }
  catch(e) {
    return Boom.expectationFailed(e.message);
  }
};

const fetchAudit = async function fetchAudits(req){
  try {
    const db = req.getDb('auditdb');
    const audit = await db.getModel('Audit').findById(req.params.id);
    if(!audit){
      return Boom.expectationFailed('audit(s) not found');
    }
    return audit;
  }
  catch(e) {
    return Boom.expectationFailed(e.message);
  }
};

const deleteAudit = async function deleteAudit(req){
  try {
    const db = req.getDb('auditdb');
    const audit = await db.getModel('Audit').findById(req.params.id);
    if(!audit){
      return Boom.expectationFailed('Audit not found');
    }
    const objections = await db.getModel('Objection').findAll({where: {auditId: audit.id }});
    if(objections){
      for (let i = 0; i < objections.length; i++) {
        const comments = await db.getModel('Comment').findAll({where: {objectionId: objections[i].id}});
        if(comments){
          for(let j=0; j<comments.length; j++){
            await comments[j].destroy();
          }
        }
        objections[i].destroy();
      }
    }
    return await audit.destroy();
  }
  catch(e) {
    Boom.expectationFailed(e.message);
  }
};

const updateAudit = async function updateAudit(req,h){
  try {
    const db = req.getDb('auditdb');
    const audit = await db.getModel('Audit').findById(req.params.id);
    if(!audit){
      return h.response().code(404);
    }
    if(req.payload.branchId){
      const result = await db.getModel('Branch').findById(req.payload.branchId);
      if(!result){
        return Boom.expectationFailed('Branch Not Found');
      }
      audit.branchId = req.payload.branchId;
    }
    if(req.payload.type){
      audit.type = req.payload.type;
    }
    if(req.payload.auditPeriodStartDate){
      audit.auditPeriodStartDate = req.payload.auditPeriodStartDate;
    }
    if(req.payload.auditPeriodEndDate){
      if(new Date(audit.auditPeriodStartDate) > new Date(req.payload.auditPeriodEndDate)){
        return Boom.expectationFailed('end date is less than start date');
      }
      else{
        audit.auditPeriodEndDate = req.payload.auditPeriodEndDate;
      }
    }
    if(req.payload.auditReportTargetDate){
      if(new Date(audit.auditPeriodEndDate) > new Date(req.payload.auditReportTargetDate)){
        return Boom.expectationFailed('target date is less than end date');
      }
      else{
        audit.auditReportTargetDate = req.payload.auditReportTargetDate;
      }
    }
    if(req.payload.auditorFirmId){
      const result = await db.getModel('User').findById(req.payload.auditorFirmId);
      if(!result){
        return Boom.expectationFailed('User Not Found');
      }
      audit.auditorFirmId = req.payload.auditorFirmId;
    }
    if(req.payload.coordinatorId){
      const result = await db.getModel('User').findById(req.payload.coordinatorId);
      if(!result){
        return Boom.expectationFailed('User Not Found');
      }
      audit.coordinatorId = req.payload.coordinatorId;
    }
    return await audit.save();
  } catch (e) {
    return Boom.expectationFailed(e.message);
  }
};
const updateAuditStatus = async (req) => {
  let oldObj = {}, newObj = {};
  let auditStatusUpdateTransaction = new Transaction(req);


  try{
    const db = req.getDb('auditdb');
    const audit = await db.getModel('Audit').findById(req.params.id);
    if (!audit){
      return Boom.expectationFailed('Audit not found');
    }
    oldObj.status = audit.status;
    newObj.status = req.payload.status;

    if (req.payload.remark) {
      audit.remark = req.payload.remark;
    }
    if(req.payload.attachments && req.payload.attachments.length){
      for (let i = 0; i < req.payload.attachments.length; i++) {
        const result = await db.getModel('Attachment').findById(req.payload.attachments[i]);
        if(!result){
          return Boom.expectationFailed('attachment not found');
        }
      }
    }

    audit.status = req.payload.status;
    audit.auditPeriodBranchManager = req.payload.auditPeriodBranchManager;
    audit.assessmentPeriodBranchManager = req.payload.assessmentPeriodBranchManager;
    audit.assessmentPeriodStartDate = req.payload.assessmentPeriodStartDate;
    audit.assessmentPeriodEndDate = req.payload.assessmentPeriodEndDate;
    const result = await audit.save();
    if(!result) {
      return Boom.expectationFailed('Error while updating obj');
    }
    auditStatusUpdateTransaction.record('Audit', audit.id, oldObj, newObj);
    auditStatusUpdateTransaction.recordComment(req.payload.remark);
    auditStatusUpdateTransaction.commit();

    if(req.payload.attachments && req.payload.attachments.length){
      for (let i = 0; i < req.payload.attachments.length; i++) {
        const attachment = await db.getModel('Attachment').findById(req.payload.attachments[i]);
        attachment.objId = result.id;
        await attachment.save();
      }
    }
    return result;
  }
  catch(err) {
    return Boom.expectationFailed(err.message);
  }
};

module.exports = {
  createAudit: createAudit,
  fetchAudits: fetchAudits,
  deleteAudit:deleteAudit,
  updateAudit: updateAudit,
  fetchAudit: fetchAudit,
  updateAuditStatus: updateAuditStatus,
  fetchAuditsCount: fetchAuditsCount
};
