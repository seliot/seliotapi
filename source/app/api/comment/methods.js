'use strict';

const Boom = require('boom');

const createComment = async (req) => {
  try{
    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findById(req.payload.objectionId);
    if (!objection){
      return Boom.expectationFailed('objection not found');
    }
    for (let i = 0; i < req.payload.attachments.length; i++) {
      const result = await db.getModel('Attachment').findById(req.payload.attachments[i]);
      if(!result){
        return Boom.expectationFailed('attachment not found');
      }
    }
    req.payload.auditId = objection.auditId;
    const comment = await db.getModel('Comment').create(req.payload);

    for (let i = 0; i < req.payload.attachments.length; i++) {
      const attachment = await db.getModel('Attachment').findById(req.payload.attachments[i]);
      attachment.objId = comment.id;
      await attachment.save();
    }
    return comment;
  }
  catch(err) {
    return Boom.expectationFailed(err.message);
  }
};

const fetchComment = async (req) => {
  try{
    const db = req.getDb('auditdb');
    const objection = await db.getModel('Objection').findById(req.query.objectionId);
    if (!objection){
      return Boom.expectationFailed('objection not found');
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
    return await db.getModel('Comment').findAll({
      where: { objectionId: req.query.objectionId, auditId: objection.auditId},
      order: sort
    });
  }
  catch(err) {
    return Boom.expectationFailed(err.message);
  }
};

module.exports = {
  createComment: createComment,
  fetchComment: fetchComment
};
