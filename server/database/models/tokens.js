export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM("CUSTOMER","DRIVER"),
      allowNull: false,
      defaultValue: "CUSTOMER"
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    token_expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    login_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    logout_time: {
      type: DataTypes.DATE
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
  }
};

export function model(sequelize, DataTypes){
  const tokens = sequelize.define('tokens', getAttributes(sequelize, DataTypes), {
    tableName: 'tokens',
    paranoid: true,
    underscored:true,
    timestamps: true,
    indexes: [
      {
        name: "tokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tokens_token",
        fields: [
          { name: "token" },
        ]
      },
    ]
  });

  tokens.associate = function(models) {

  };
  return tokens;
}
