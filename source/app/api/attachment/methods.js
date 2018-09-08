'use strict';

const Boom = require('boom');
const fs = require('fs');
const uploader = require('./uploader').uploader;
const s3Handler = require('../../../config/development.js').s3Handler;

const UPLOAD_PATH = 'uploads';
const fileOptions = { dest: `${UPLOAD_PATH}/` };

const uploadAttachment = async (req) => {
  try {
    const data = req.payload;
    const file = data['file'];
    const fileDetails = await uploader(file, fileOptions);
    return new Promise((resolve, reject) => {
      fs.readFile(fileDetails.path, function (err, data) {
        if(err){
          reject(Boom.expectationFailed(err.message));
        }
        s3Handler.put(fileDetails.filename, data, function (err) {
          if(err){
            reject(Boom.expectationFailed(err.message));
          }
          const attachment = {
            objType: req.payload.objType,
            name: fileDetails.filename,
            sizeKb: ((fileDetails.size)/1024),
            path: fileDetails.filename
          };
          if(req.payload.type){
            attachment.type = req.payload.type;
          }
          const db = req.getDb('auditdb');
          db.getModel('Attachment').create(attachment).then( (attach) => {
            resolve(attach);
          });
        });
      });
    });
  } catch (e) {
    return Boom.expectationFailed(e.message);
  }
};

const downloadAttachment = async (req,h) => {
  try {
    const db = req.getDb('auditdb');
    const attachment = await db.getModel('Attachment').findById(req.params.id);
    if(!attachment){
      return Boom.expectationFailed('attachment not found');
    }
    const downloadable = await db.getModel('Downloadable').findOne({where: {token: req.query.token, attachmentId: req.params.id}});
    if(!downloadable){
      return Boom.expectationFailed('token not found');
    }

    if(!(new Date(downloadable.validTill) > new Date())){
      return Boom.expectationFailed('token is expired');
    }
    const readFilename = attachment.name;
    const s3readStream = s3Handler.createReadStream(readFilename, { length: 64 * 1024 });
    if(req.query.disposition === 'inline')
      return h.response(s3readStream).header('Content-Disposition', `inline; filename=${readFilename}`);

    return h.response(s3readStream).header('Content-Disposition', `attachment; filename=${readFilename}`);
  }
  catch (e){
    return Boom.expectationFailed(e.message);
  }
};

const fetchAttachments = async (req) => {
  try {
    const db = req.getDb('auditdb');
    const condition = {};
    condition.objId = req.query.objId;
    if(req.query.types){
      condition.type = req.query.types;
    }
    const attachments = await db.getModel('Attachment').findAll({where: condition });
    return attachments;
  }
  catch(e){
    return Boom.expectationFailed(e.message);
  }
};

const downloadLink = async (req) => {
  try {
    const db = req.getDb('auditdb');
    const attachment = await db.getModel('Attachment').findAll({ where: {id: req.params.id} });
    if(!attachment){
      return Boom.expectationFailed('attachment not found');
    }
    const validTill = new Date();
    validTill.setMinutes(validTill.getMinutes() + 15);

    const downloadable = await db.getModel('Downloadable').create({ attachmentId: req.params.id, validTill: validTill });

    return {link: `/attachment/${downloadable.attachmentId}?token=${downloadable.token}`};
  }
  catch(e){
    return Boom.expectationFailed(e.message);
  }
};

module.exports = {
  uploadAttachment: uploadAttachment,
  downloadAttachment: downloadAttachment,
  fetchAttachments: fetchAttachments,
  downloadLink: downloadLink
};
