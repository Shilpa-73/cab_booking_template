module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 5).map((value, index) => ({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      cab_station_id: index + 1,
      address: faker.address.streetAddress()
    }));
    return queryInterface.bulkInsert('admin', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('admin', null, {})
};
