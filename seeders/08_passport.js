module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    let customerId = 1;
    let driverId = 1;

    const arr = range(1, 100).map((value, index) => ({
      user_type: index >= 50 ? 'CUSTOMER' : 'DRIVER',
      user_id: index >= 50 ? customerId++ : driverId++,
      provider_type: 'LOCAL',
      password: faker.internet.password()
    }));
    return queryInterface.bulkInsert('passport', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('passport', null, {})
};
