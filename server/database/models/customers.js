export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mobileNo: {
      field: 'mobile_no',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birthDate: {
      field: 'birth_date',
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.TEXT
    },
    country: {
      type: DataTypes.TEXT
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true
    }
  };
}

export function model(sequelize, DataTypes) {
  const customers = sequelize.define('customers', getAttributes(sequelize, DataTypes), {
    tableName: 'customers',
    paranoid: true,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'customer_email',
        fields: [{ name: 'email' }]
      },
      {
        name: 'customer_mobile_no',
        unique: true,
        fields: [{ name: 'mobile_no' }]
      },
      {
        name: 'customers_pkey',
        unique: true,
        fields: [{ name: 'id' }]
      },
      {
        name: 'drivers_mobile_no',
        unique: true,
        fields: [{ name: 'mobile_no' }]
      }
    ]
  });

  customers.associate = function (models) {
    customers.hasMany(models.bookings, { as: 'bookings', foreignKey: 'customer_id' });
  };
  return customers;
}
