module.exports = function(sequelize, DataTypes) {
  const Objection = sequelize.define('Objection', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open'
    },
    closeRemark: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  Objection.associate = function(models) {
    models.Objection.hasMany(models.Comment, {foreignKey: 'objectionId', sourceKey: 'id'});
  };
  return Objection;
};
