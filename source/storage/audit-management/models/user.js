module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      notEmpty: true
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    },
  }, {
    timestamps: false,
    paranoid: true
  });
  User.associate = function(models) {
    models.User.hasMany(models.Audit, {foreignKey: 'auditorFirmId', sourceKey: 'id'});
    models.User.hasMany(models.Audit, {foreignKey: 'coordinatorId', sourceKey: 'id'});
    models.User.hasMany(models.Audit, {foreignKey: 'auditPeriodBranchManager', sourceKey: 'id'});
    models.User.hasMany(models.Audit, {foreignKey: 'assessmentPeriodBranchManager', sourceKey: 'id'});
  };
  return User;
};
