export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_type: {
      type: DataTypes.ENUM("CUSTOMER","DRIVER"),
      allowNull: false,
      defaultValue: "CUSTOMER"
    },
    provider_type: {
      type: DataTypes.ENUM("GOOGLE","GITHUB","LOCAL"),
      allowNull: false,
      defaultValue: "GOOGLE"
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    service_provider_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
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
  };
};

export function model(sequelize, DataTypes){
  const passport = sequelize.define('passport', getAttributes(sequelize, DataTypes), {
    tableName: 'passport',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        name: "passport_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "passport_user_type",
        unique: true,
        fields: [
          { name: "user_type" },
          { name: "user_id" },
          { name: "provider_type" },
        ]
      },
    ]
  });

  passport.associate = function(models) {

  };
  return passport;
}

