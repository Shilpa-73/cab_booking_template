export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicleNumber: {
      field: 'vehicle_number',
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ownerId: {
      field: 'owner_id',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vehicleCategoryId: {
      field: 'vehicle_category_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicle_categories',
        key: 'id'
      }
    },
    vehicleSubCategoryId: {
      field: 'vehicle_sub_category_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicle_sub_categories',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    modelNo: {
      field: 'model_no',
      type: DataTypes.TEXT,
      allowNull: false
    },
    brandName: {
      field: 'brand_name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    manufacturingYear: {
      field: 'manufacturing_year',
      type: DataTypes.STRING(4),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
  const vehicles = sequelize.define('vehicles', getAttributes(sequelize, DataTypes), {
    tableName: 'vehicles',
    paranoid: true,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'vehicles_pkey',
        unique: true,
        fields: [{ name: 'id' }]
      }
    ]
  });

  vehicles.associate = function (models) {
    vehicles.belongsTo(models.vehicleCategories, { as: 'vehicle_category', foreignKey: 'vehicle_category_id' });
    vehicles.belongsTo(models.vehicleSubCategories, {
      as: 'vehicle_sub_category',
      foreignKey: 'vehicle_sub_category_id'
    });
    vehicles.hasMany(models.bookings, { as: 'bookings', foreignKey: 'vehicle_id' });
  };
  return vehicles;
}
