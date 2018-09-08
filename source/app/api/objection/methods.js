const Boom = require('boom');
const Transaction = require('../../utils/transaction');

const createObjection = async (req) => {
  try {
    const db = req.getDb('auditdb') ;

    for (let i = 0; i < req.payload.attachments.length; i++) {
      const result = await db.getModel('Attachment').findById(req.payload.attachments[i]);
      if(!result){
        return Boom.expectationFailed('attachment not found');
      }
    }

    const objection = await db.getModel('Objection').create(req.payload);

    for (let i = 0; i < req.payload.attachments.length; i++) {
      const attachment = await db.getModel('Attachment').findById(req.payload.attachments[i]);
      attachment.objId = objection.id;
      await attachment.save();
    }
    return objection;
  }catch(err) {
    return Boom.expectationFailed(err.message);
  }

};

const getObjection = async (req) => {
  try {
    let limit = req.query.pageSize;
    let offset = limit * (req.query.pageNo - 1);
    const db = req.getDb('auditdb');
    const where = {};

    if(req.query.ids) {
      where.id = req.query.ids;
    }
    if(req.query.auditIds) {
      where.auditId = req.query.auditIds;
    }
    if (req.query.types) {
      where.type = req.query.types;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.severity) {
      where.severity = req.query.severity;
    }
    if (req.query.feilds) {
      where.feilds = req.query.feilds;
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
    const objection = await db.getModel('Objection').findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: sort
    });

    return objection;
  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
const fetchObjectionsCount = async function fetchObjectionsCount(req){
  try {
    const db = req.getDb('auditdb');
    const where = {};
    if(req.query.auditIds) {
      where.auditId = req.query.auditIds;
    }
    if (req.query.types) {
      where.type = req.query.types;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.severity) {
      where.severity = req.query.severity;
    }
    if (req.query.feilds) {
      where.feilds = req.query.feilds;
    }
    // const result = await db.getModel('Audit').findById(req.payload.ids);
    // if(!result){
    //   return Boom.expectationFailed('Objection(s) not found');
    // }

    const objections = await db.getModel('Objection').findAndCountAll({ where: where });
    return objections.count;

  }
  catch(e) {
    return Boom.expectationFailed(e.message);
  }
};
const getObjectionDetail = async (req) => {
  try {

    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findOne({where: {id: req.params.id}});
    if(!objection){
      return Boom.expectationFailed('Objection(s) not found');
    }
    return objection;
  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
const updateObjection = async (req) => {
  try{
    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findOne({where: {id: req.params.id}});
    if(!objection){
      return Boom.expectationFailed('Objection not found');
    }
    objection.type = req.payload.type,
    objection.title = req.payload.title,
    objection.message = req.payload.message;
    objection.severity = req.payload.severity;
    return await objection.save();
  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
const updateObjectionStatus = async (req) => {
  let oldObj = {}, newObj = {};
  let objectionStatusUpdateTransaction = new Transaction(req);


  try{
    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findOne({where: {id: req.params.id}});
    if(!objection) {
      return Boom.expectationFailed('Objection not found');
    }
    oldObj.status = objection.status;
    newObj.status = req.payload.status;

    objection.status = req.payload.status;
    objection.closeRemark = req.payload.closeRemark;

    const result = await objection.save();
    if(!result) {
      return Boom.expectationFailed('Error while updating obj');
    }
    objectionStatusUpdateTransaction.record('Objection', objection.id, oldObj, newObj);
    objectionStatusUpdateTransaction.recordComment(req.payload.closeRemark);
    objectionStatusUpdateTransaction.commit();

    return objection;

  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
const deleteObjection = async (req) => {
  try{
    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findOne({where: {id: req.params.id}});
    if(!objection){
      return Boom.expectationFailed('objection not found');
    }

    await db.getModel('Comment').destroy({where: { objectionId: req.params.id }});

    objection.destroy();

    return objection;
  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};

module.exports = {
  createObjection: createObjection,
  getObjection: getObjection,
  fetchObjectionsCount: fetchObjectionsCount,
  getObjectionDetail: getObjectionDetail,
  updateObjection: updateObjection,
  deleteObjection: deleteObjection,
  updateObjectionStatus: updateObjectionStatus
};
