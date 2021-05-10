export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    long: {
      type: DataTypes.DOUBLE,
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
    address: {
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
  }
};

export function model(sequelize, DataTypes){
  const cabStations = sequelize.define('cab_stations', getAttributes(sequelize, DataTypes), {
    tableName: 'cab_stations',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        name: "address_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "adress_type_item_id",
        unique: true,
        fields: [
          { name: "type" },
          { name: "item_id" },
        ]
      },
    ]
  });

  cabStations.associate = function(models) {
    cabStations.hasMany(models.admin, { as: "admins", foreignKey: "cab_station_id"});
  };
  return cabStations;
}