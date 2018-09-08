module.exports = function(sequelize, DataTypes) {
  const History = sequelize.define('History', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    objType: {
      type: DataTypes.STRING
    },
    objId: {
      type: DataTypes.UUID,
    },
    key: {
      type: DataTypes.STRING
    },
    oldValue: {
      type: DataTypes.STRING
    },
    newValue: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true
  });
  return History;
};
