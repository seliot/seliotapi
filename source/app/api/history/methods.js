const Boom = require('boom');

const getHistoryList = async (req, h) => {
  try {
    let limit = req.query.pageSize ;
    let offset = limit * (req.query.pageNo - 1);

    const db = req.getDb('auditdb');
    let historyEntries, where = {
      objType: req.query.objectType,
      objId: req.params.objectId
    };
    if(req.params.key && req.query.key.length){
      where['key'] = { $in: req.query.key };
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
    const histories = db.getModel('History').findAll({
      where,
      limit: limit,
      offset: offset,
      order: sort
    });
    if (!histories.length) {
      return histories;
    }
    historyEntries = histories.slice();
    let transactionPromise = [];
    histories.map((history) => {
      transactionPromise.push(db.getModel('Transaction').findOne({id: history.transactionId}));
    });

    return Promise.all(transactionPromise)
      .then((transactions) => {
        historyEntries.map((historyObj) => {
          transactions.map((transactionObj) => {
            if ((transactionObj.id.toString() === historyObj.transactionId.toString()) && transactionObj.message) {
              historyObj['message'] = transactionObj.message;
            }
          });
        });
        return h(historyEntries);
      });

  } catch(DBException) {
    console.error(DBException);
    return Boom.expectationFailed(DBException.message);
  }
};
const getHistoryCount = async function getHistoryCount(req) {
  try {
    const db = req.getDb('auditdb');
    let where = {
      objType: req.query.objectType,
      objId: req.params.objectId
    };
    if(req.params.key && req.query.key.length){
      where['key'] = { $in: req.query.key };
    }
    const history = await db.getModel('History').findAndCountAll({where});

    return history.count;

  } catch(err) {
    return Boom.expectationFailed(err.message);
  }
};
module.exports = {
  getHistoryCount: getHistoryCount,
  getHistoryList: getHistoryList
};
