module.exports = function(sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    message: {
      type: DataTypes.STRING,
      allowNull:false,
      notEmpty: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    timestamps: true,
    paranoid: true
  });
  return Comment;
};
