const Sequelize = require('sequelize');
const dbconfig = require('../../../config')['storage']['auditmanagement'];
const sequelize = new Sequelize(dbconfig);
const queryInterface = sequelize.getQueryInterface();

module.exports = {
  up: () => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT,
        required: true
      },
      description: {
        type: Sequelize.TEXT
      },
      milestoneId: {
        type: Sequelize.INTEGER,
        required: true
      },
      assignee: {
        type: Sequelize.INTEGER,
        required: true
      },
      status: {
        type: Sequelize.STRING,
        default: 'Pending'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        required: true
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        required: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: () => {
    return queryInterface.dropTable('tasks');
  }
};
