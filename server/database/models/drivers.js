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
    driving_license_number: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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