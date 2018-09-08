'use strict';

const Boom = require('boom');

const fetchBranch = async (req) => {
  try {
    const db = req.getDb('auditdb');
    if(req.query.id){
      const branch = await db.getModel('Branch').findById(req.query.id);
      return branch;
    }
    const branches = await db.getModel('Branch').findAll();
    return branches;
  } catch (e) {
    return Boom.expectationFailed(e.message);
  }
};
module.exports = {
  fetchBranch: fetchBranch
};
