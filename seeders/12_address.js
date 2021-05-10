module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const vehicleArr = range(1, 100).map((value, index) => ({
      item_id: index + 1,
      type: 'VEHICLE',
      lat: faker.address.latitude(),
      long: faker.address.longitude()
    }));

    const driverArr = range(1, 51).map((value, index) => ({
      item_id: index + 1,
      type: 'DRIVER',
      lat: faker.address.latitude(),
      long: faker.address.longitude()
    }));
    const arr = vehicleArr.concat(driverArr);
    return queryInterface.bulkInsert('address', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('address', null, {})
};
