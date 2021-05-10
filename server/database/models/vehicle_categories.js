export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
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
  const vehicleCategories = sequelize.define('vehicle_categories', getAttributes(sequelize, DataTypes), {
    tableName: 'address',
    paranoid: true,
    underscored:true,
    timestamps: true,
    indexes: [
      {
        name: "vehicle_categories_name",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "vehicle_categories_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  vehicleCategories.associate = function(models) {

    vehicleCategories.hasMany(models.vehicles,
        { as: "vehicles", foreignKey: "vehicle_category_id"});

    vehicleCategories.hasMany(models.vehicleSubCategories, { as: "vehicle_sub_categories", foreignKey: "vehicle_category_id"});

  };
  return vehicleCategories;
}