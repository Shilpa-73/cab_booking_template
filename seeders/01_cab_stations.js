module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    // console.log(`faker lat long`, faker.local_latlng('IN'));

    const arr = range(1, 5).map((value, index) => ({
      name: faker.company.companyName(),
      lat: faker.address.latitude(),
      long: faker.address.latitude(),
      country: faker.address.country(),
      city: faker.address.city(),
      state: faker.address.state(),
      address: faker.address.streetAddress()
    }));
    return queryInterface.bulkInsert('cab_stations', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('cab_stations', null, {})
};
