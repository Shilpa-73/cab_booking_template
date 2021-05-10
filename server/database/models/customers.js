export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mobile_no: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    country: {
      type: DataTypes.TEXT,
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
  const customers = sequelize.define('customers', getAttributes(sequelize, DataTypes), {
    tableName: 'customers',
    paranoid: true,
    underscored:true,
    timestamps: true,
    indexes: [
      {
        name: "customer_email",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "customer_mobile_no",
        unique: true,
        fields: [
          { name: "mobile_no" },
        ]
      },
      {
        name: "customers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "drivers_mobile_no",
        unique: true,
        fields: [
          { name: "mobile_no" },
        ]
      },
    ]
  });

  customers.associate = function(models) {

    customers.hasMany(models.bookings, { as: "bookings", foreignKey: "customer_id"});
  };
  return customers;
}
