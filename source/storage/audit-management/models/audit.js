module.exports = function(sequelize, DataTypes) {
  const Audit = sequelize.define('Audit', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Internal'
    },
    auditPeriodStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      notEmpty: true
    },
    auditPeriodEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
      notEmpty: true
    },
    auditReportTargetDate: {
      type: DataTypes.DATE,
      allowNull: false,
      notEmpty: true
    },
    assessmentPeriodStartDate: {
      type: DataTypes.DATE,
      notEmpty: true
    },
    assessmentPeriodEndDate: {
      type: DataTypes.DATE,
      notEmpty: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open'
    },
    remark: {
      type: DataTypes.STRING
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  Audit.associate = function(models) {
    models.Audit.hasMany(models.Comment, {foreignKey: 'auditId', sourceKey: 'id'});
    models.Audit.hasMany(models.Objection, {foreignKey: 'auditId', sourceKey: 'id'});
  };
  return Audit;
};
