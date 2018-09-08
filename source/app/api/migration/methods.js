'use strict';

const Boom = require('boom');
const Umzug = require('umzug');

const migrate = async (req) => {
  try {
    const migratemaindb = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: req.getDb('auditmanagement').sequelize,
        // The name of table to create if `model` option is not supplied
        // Defaults to `modelName`
        modelName: 'migrations',

        // The name of table column holding migration name.
        // Defaults to 'name'.
        columnName: 'name'
      },
      migrations: {
        path: 'storage/audit-management/migrations'
      }
    });
    await migratemaindb.up();
    return '';
  } catch (e) {
    return Boom.expectationFailed(e.message);
  }
}

module.exports = {
  migrate: migrate
};
