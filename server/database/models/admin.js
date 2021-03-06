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
    cabStationId: {
      field: 'cab_station_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cab_stations',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
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
  const admin = sequelize.define('admin', getAttributes(sequelize, DataTypes), {
    tableName: 'admin',
    paranoid: true,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'admin_pkey',
        unique: true,
        fields: [{ name: 'id' }]
      }
    ]
  });

  admin.associate = function (models) {};
  return admin;
}
