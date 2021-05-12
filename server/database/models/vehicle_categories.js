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
  const vehicleCategories = sequelize.define('vehicle_categories', getAttributes(sequelize, DataTypes), {
    tableName: 'vehicle_categories',
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
