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
    vehicleCategoryId: {
      field:'vehicle_category_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicle_sub_categories',
        key: 'id'
      }
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
  };
};

export function model(sequelize, DataTypes){
  const vehicleSubCategories = sequelize.define('vehicle_sub_categories', getAttributes(sequelize, DataTypes), {
    tableName: 'vehicle_sub_categories',
    paranoid: true,
    underscored:true,
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

  vehicleSubCategories.associate = function(models) {
    vehicleSubCategories.belongsTo(models.vehicleCategories, { as: "vehicle_category", foreignKey: "vehicle_category_id"});
    vehicleSubCategories.hasMany(models.vehicles, { as: "vehicles", foreignKey: "vehicle_sub_category_id"});
  };
  return vehicleSubCategories;
}
