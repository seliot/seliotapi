module.exports = function(sequelize, DataTypes){
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  Branch.associate = function(models) {
    models.Branch.hasMany(models.Audit, {foreignKey: 'branchId', sourceKey: 'id'});
  };
  return Branch;
};
