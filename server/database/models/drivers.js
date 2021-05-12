export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      field:'first_name',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    lastName: {
      field:'last_name',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mobileNo: {
      field:'mobile_no',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birthDate: {
      field:'birth_date',
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
    drivingLicenseNumber: {
      field:'driving_license_number',
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      field:'created_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('now')
    },
    updatedAt: {
      field:'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      field:'deleted_at',
      type: DataTypes.DATE,
      allowNull: true
    }
  }
};

export function model(sequelize, DataTypes){
  const drivers = sequelize.define('drivers', getAttributes(sequelize, DataTypes), {
    tableName: 'drivers',
    paranoid: true,
    underscored:true,
    timestamps: true,
    indexes: [
      {
        name: "drivers_email",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "drivers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  drivers.associate = function(models) {
    drivers.hasMany(models.bookings, { as: "bookings", foreignKey: "driver_id"});
  };
  return drivers;
}