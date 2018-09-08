module.exports = function(sequelize, DataTypes){
  const Downloadable = sequelize.define('Downloadable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    validTill: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true
  });
  return Downloadable;
};
