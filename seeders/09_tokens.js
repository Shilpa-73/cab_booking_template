module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 100).map((value, index) => ({
      type: index > 50 ? 'CUSTOMER' : 'DRIVER',
      user_id: index >= 50 ? parseInt(index / 2) : index + 1,
      token: faker.lorem.text(),
      token_expiry: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      login_time: new Date(),
      logout_time: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
    }));
    return queryInterface.bulkInsert('tokens', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('tokens', null, {})
};
