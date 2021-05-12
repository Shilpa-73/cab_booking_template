export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM("VEHICLE","DRIVER"),
      allowNull: false,
      defaultValue: "DRIVER"
    },
    itemId: {
      field:'item_id',
      type: DataTypes.INTEGER,
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
  const address = sequelize.define('address', getAttributes(sequelize, DataTypes), {
    tableName: 'address',
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

  address.associate = function(models) {

  };
  return address;
}
