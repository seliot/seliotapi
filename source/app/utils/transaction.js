let changesets = require('diff-json');

class Transaction {

  constructor(req) {
    this.db = req.getDb('auditdb') ;
    this.changeset = [];
    //this.entity = [];
    this.message = '';
  }

  recordComment(message) {
    this.message = message;
  }

  record(entity, entityID, oldValue, newValue) {
    let diffs = changesets.diff(oldValue, newValue);
    if (!diffs.length) {
      return console.log('Record - No changes to record');
    }
    //this.entity.push({ objType: entity, objID: entityID });
    diffs.map((diff) => {
      if (diff.type === 'add' || diff.type === 'update') {
        diff.objId = entityID;
        diff.objType = entity;
        this.changeset.push(diff);
      }
    });
  }
  commit() {
    if (!this.changeset.length) {
      console.log('Commit - No changes to record');
      return;
    }
    let transactionObject = {};
    return new Promise((resolve, reject) => {

      if (this.message) {
        transactionObject.message = this.message;
      }

      this.db.getModel('Transaction').create(transactionObject)
        .then((res) => {
          let historyArray = [];
          this.changeset.map((changeset) => {
            historyArray.push({
              key: changeset.key,
              oldValue: changeset.oldValue,
              newValue: changeset.value,
              transactionId: res.id,
              objType: changeset.objType,
              objId: changeset.objId
            });
          });
          return this.db.getModel('History').bulkCreate(historyArray)
            .then(() => {
              console.log('Changes committed');
              return resolve();
            });
        })
        .catch((DBException) => {
          console.error(DBException.message);
          return reject(DBException.message);
        });
    });
  }

}
module.exports = Transaction;
