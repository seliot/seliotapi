module.exports = function(sequelize, DataTypes) {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true
  });
  Transaction.associate = function(models) {
    models.Transaction.hasMany(models.History, {foreignKey: 'transactionId', sourceKey: 'id'});
  };
  return Transaction;
};
