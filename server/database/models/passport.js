export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userType: {
      field: 'user_type',
      type: DataTypes.ENUM('CUSTOMER', 'DRIVER'),
      allowNull: false,
      defaultValue: 'CUSTOMER'
    },
    providerType: {
      field: 'provider_type',
      type: DataTypes.ENUM('GOOGLE', 'GITHUB', 'LOCAL'),
      allowNull: false,
      defaultValue: 'GOOGLE'
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    serviceProviderId: {
      field: 'service_provider_id',
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
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
  const passport = sequelize.define('passport', getAttributes(sequelize, DataTypes), {
    tableName: 'passport',
    paranoid: true,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'passport_pkey',
        unique: true,
        fields: [{ name: 'id' }]
      },
      {
        name: 'passport_user_type',
        unique: true,
        fields: [{ name: 'user_type' }, { name: 'user_id' }, { name: 'provider_type' }]
      }
    ]
  });

  passport.associate = function (models) {};
  return passport;
}
