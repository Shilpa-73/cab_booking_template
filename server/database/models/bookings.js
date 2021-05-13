export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bookingType: {
      field: 'booking_type',
      type: DataTypes.ENUM('DAILY_RIDE', 'OUTSTATION', 'RENTAL'),
      allowNull: false,
      defaultValue: 'DAILY_RIDE'
    },
    sourceAddress: {
      field: 'source_address',
      type: DataTypes.TEXT,
      allowNull: true
    },
    destinationAddress: {
      field: 'destination_address',
      type: DataTypes.TEXT,
      allowNull: false
    },
    pickupAddress: {
      field: 'pickup_address',
      type: DataTypes.TEXT,
      allowNull: false
    },
    pickupLat: {
      field: 'pickup_lat',
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    pickupLong: {
      field: 'pickup_long',
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    destinationLat: {
      field: 'destination_lat',
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    destinationLong: {
      field: 'destination_long',
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('REQUESTED', 'CAB_ASSIGNED', 'CONFIRMED', 'NOT_AVAILABLE'),
      allowNull: false,
      defaultValue: 'REQUESTED'
    },
    customerId: {
      field: 'customer_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    driverId: {
      field: 'driver_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'drivers',
        key: 'id'
      }
    },
    confirmedBy: {
      field: 'confirmed_by',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admin',
        key: 'id'
      }
    },
    vehicleId: {
      field: 'vehicle_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    startTime: {
      field: 'start_time',
      type: DataTypes.TIME,
      allowNull: true
    },
    endTime: {
      field: 'end_time',
      type: DataTypes.TIME,
      allowNull: true
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
  const bookings = sequelize.define('bookings', getAttributes(sequelize, DataTypes), {
    tableName: 'bookings',
    paranoid: true,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'bookings_customer_id',
        fields: [{ name: 'customer_id' }]
      },
      {
        name: 'bookings_driver_id',
        fields: [{ name: 'driver_id' }]
      },
      {
        name: 'bookings_pkey',
        unique: true,
        fields: [{ name: 'id' }]
      },
      {
        name: 'bookings_vehicle_id',
        fields: [{ name: 'vehicle_id' }]
      }
    ]
  });

  bookings.associate = function (models) {
    bookings.belongsTo(models.admin, { as: 'confirmed_by_admin', foreignKey: 'confirmed_by' });
    bookings.hasMany(models.payments, { as: 'payments', foreignKey: 'booking_id' });

    bookings.belongsTo(models.vehicles, { as: 'vehicle', foreignKey: 'vehicle_id' });
    bookings.belongsTo(models.drivers, { as: 'driver', foreignKey: 'driver_id' });
    bookings.belongsTo(models.customers, { as: 'customer', foreignKey: 'customer_id' });
  };
  return bookings;
}
