import isNil from 'lodash/isNil';
import set from 'lodash/set';
import {
  cabStationsTable,
  adminTable,
  vehicleCategoriesTable,
  vehicleSubCategoriesTable,
  vehiclesTable,
  customersTable,
  driversTable,
  passportTable,
  bookingTable,
  paymentTable,
  addressTable,
  tokenTable
} from '@server/utils/testUtils/mockData';
import sequelize from 'sequelize';
import request from 'supertest';

const defineAndAddAttributes = (connection, name, mock, attr, total = 10) => {
  const mockTable = connection.define(name, mock, {
    instanceMethods: {
      findAll: () => [mock],
      findOne: () => mock
    }
    // sequelize:{...connection}
  });

  // console.log(`mockTable.sequelize query is`, mockTable.sequelize.QueryTypes.SELECT)

  mockTable.rawAttributes = attr;
  mockTable.manyFromSource = { count: () => new Promise((resolve) => resolve(total)) };
  set(mockTable, 'sequelize.dialect', 'postgres');
  set(mockTable, 'sequelize.QueryTypes', sequelize.QueryTypes);
  // set(mockTable, 'sequelize.query', connection.query);

  // console.log(`mockTable.sequelize is here `, mockTable.sequelize, connection.sequelize)
  console.log(`mockTable.sequelize1 is here `, connection.query);

  return mockTable;
};
export const getResponse = async (query, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').testApp;
  }
  return await request(app).post('/graphql').type('form').send({ query }).set('Accept', 'application/json');
};

export function mockDBClient(config = {}) {
  const SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  const dbConnectionMock = new SequelizeMock();
  dbConnectionMock.options = { dialect: 'mock' };

  const cabStationsMock = defineAndAddAttributes(
    dbConnectionMock,
    'cab_stations',
    cabStationsTable[0],
    require('@database/models/cab_stations').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const adminMock = defineAndAddAttributes(
    dbConnectionMock,
    'admin',
    adminTable[0],
    require('@database/models/admin').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const vehicleCategoriesMock = defineAndAddAttributes(
    dbConnectionMock,
    'vehicle_categories',
    vehicleCategoriesTable[0],
    require('@database/models/vehicle_categories').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  /* purchasedProductsMock.$queryInterface.$useHandler(function(query, queryOptions) {
    if (query === 'findAll') {
      return config?.purchasedProducts?.findAll;
    }
    return config?.purchasedProducts;
  }); */

  const vehicleSubCategoriesMock = defineAndAddAttributes(
    dbConnectionMock,
    'vehicle_sub_categories',
    vehicleSubCategoriesTable[0],
    require('@database/models/vehicle_sub_categories').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const vehiclesMock = defineAndAddAttributes(
    dbConnectionMock,
    'vehicles',
    vehiclesTable[0],
    require('@database/models/vehicles').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const customersMock = defineAndAddAttributes(
    dbConnectionMock,
    'customers',
    customersTable[0],
    require('@database/models/customers').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const driversMock = defineAndAddAttributes(
    dbConnectionMock,
    'drivers',
    driversTable[0],
    require('@database/models/drivers').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const passportMock = defineAndAddAttributes(
    dbConnectionMock,
    'passport',
    passportTable[0],
    require('@database/models/passport').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const tokenMock = defineAndAddAttributes(
    dbConnectionMock,
    'tokens',
    tokenTable[0],
    require('@database/models/tokens').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const bookingMock = defineAndAddAttributes(
    dbConnectionMock,
    'bookings',
    bookingTable[0],
    require('@database/models/bookings').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const paymentMock = defineAndAddAttributes(
    dbConnectionMock,
    'payments',
    paymentTable[0],
    require('@database/models/payments').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const addressMock = defineAndAddAttributes(
    dbConnectionMock,
    'address',
    addressTable[0],
    require('@database/models/address').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  return {
    client: dbConnectionMock,
    models: {
      cabStations: cabStationsMock,
      admin: adminMock,
      vehicleCategories: vehicleCategoriesMock,
      vehicleSubCategories: vehicleSubCategoriesMock,
      vehicles: vehiclesMock,
      customers: customersMock,
      bookings: bookingMock,
      drivers: driversMock,
      passport: passportMock,
      tokens: tokenMock,
      payments: paymentMock,
      address: addressMock
    }
  };
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    console.error(error);
  }
}

export const resetAndMockDB = (mockCallback, config, db) => {
  if (!db) {
    db = mockDBClient(config);
  }
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  jest.doMock('@database', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return { getClient: () => db.client, client: db.client, connect: () => {} };
  });
  jest.doMock('@database/models', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return db.models;
  });
  return db.client;
};
export const createFieldsWithType = (fields) => {
  const fieldsWithType = [];
  Object.keys(fields).forEach((key) => {
    fieldsWithType.push({
      name: key,
      type: {
        name: fields[key].type
      }
    });
  });
  return fieldsWithType;
};

const getExpectedField = (expectedFields, name) => expectedFields.filter((field) => field.name === name);

export const expectSameTypeNameOrKind = (result, expected) =>
  result.filter((field) => {
    const expectedField = getExpectedField(expected, field.name)[0];
    // @todo check for connection types.
    if (!isNil(expectedField)) {
      return expectedField.type.name === field.type.name || expectedField.type.kind === field.type.kind;
    }
    return false;
  }).length === 0;
