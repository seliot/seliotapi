'use strict';

const Boom = require('boom');

const fetchUsers = async (req) => {
  try {
    const db = req.getDb('auditdb');
    if(req.query.id){
      const user = await db.getModel('User').findById(req.query.id);
      return user;
    }
    const users = await db.getModel('User').findAll();
    return users;
  } catch (e) {
    return Boom.expectationFailed(e.message);
  }
};
module.exports = {
  fetchUsers: fetchUsers
};
