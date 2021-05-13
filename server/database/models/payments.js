export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    payment_mode: {
      type: DataTypes.ENUM("CASH","CREDIT_CARD","DEBIT_CARD"),
      allowNull: false,
      defaultValue: "CASH"
    },
    payment_meta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payable_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  };
};

export function model(sequelize, DataTypes){
  const payments = sequelize.define('payments', getAttributes(sequelize, DataTypes), {
    tableName: 'payments',
    paranoid: true,
    underscored:true,
    timestamps: true,
    indexes: [
      {
        name: "payments_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  payments.associate = function(models) {

    payments.belongsTo(models.bookings, { as: "booking", foreignKey: "booking_id"});
  };
  return payments;
}
