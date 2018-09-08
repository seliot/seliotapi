module.exports = function(sequelize, DataTypes) {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.TEXT,
      required: true
    },
    description: {
      type: DataTypes.TEXT
    },
    milestoneId: {
      type: DataTypes.INTEGER,
      required: true
    },
    assignee: {
      type: DataTypes.INTEGER,
      required: true
    },
    status: {
      type: DataTypes.STRING,
      default: 'Pending'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      required: true
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      required: true
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  // Task.sync();
  return Task;
};
