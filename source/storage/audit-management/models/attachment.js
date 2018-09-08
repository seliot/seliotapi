module.exports = function(sequelize, DataTypes) {
  const Attachment = sequelize.define('Attachment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    objType: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    objId: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    sizeKb: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Attachment'
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  Attachment.associate = function(models) {
    models.Attachment.hasOne(models.Downloadable, {foreignKey: 'attachmentId', sourceKey: 'id'});
  };
  return Attachment;
};
