module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 51).map((value, index) => ({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      mobile_no:
        faker.random
          .number({
            min: 80,
            max: 90
          })
          .toString() +
        faker.random
          .number({
            min: 1004,
            max: 4000
          })
          .toString() +
        faker.random
          .number({
            min: 1004,
            max: 4000
          })
          .toString(),
      email: faker.internet.email(),
      birth_date: faker.date.past(),
      country: faker.address.country(),
      city: faker.address.city(),
      state: faker.address.state(),
      address: faker.address.streetAddress(),
      driving_license_number: faker.random.number(),
      active: true
    }));
    return queryInterface.bulkInsert('drivers', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('drivers', null, {})
};
