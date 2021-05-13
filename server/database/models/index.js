import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getClient } from '../index';

export const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

const sequelize = getClient();

db.cabStations = require('@database/models/cab_stations').model(sequelize, Sequelize.DataTypes);
db.admin = require('@database/models/admin').model(sequelize, Sequelize.DataTypes);
db.vehicleCategories = require('@database/models/vehicle_categories').model(sequelize, Sequelize.DataTypes);
db.vehicleSubCategories = require('@database/models/vehicle_sub_categories').model(sequelize, Sequelize.DataTypes);
db.vehicles = require('@database/models/vehicles').model(sequelize, Sequelize.DataTypes);

db.customers = require('@database/models/customers').model(sequelize, Sequelize.DataTypes);
db.drivers = require('@database/models/drivers').model(sequelize, Sequelize.DataTypes);
db.passport = require('@database/models/passport').model(sequelize, Sequelize.DataTypes);
db.tokens = require('@database/models/tokens').model(sequelize, Sequelize.DataTypes);
db.bookings = require('@database/models/bookings').model(sequelize, Sequelize.DataTypes);
db.payments = require('@database/models/payments').model(sequelize, Sequelize.DataTypes);
db.address = require('@database/models/address').model(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

export default db;
