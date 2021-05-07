module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 100).map((value, index) => ({
      booking_id: index + 1,
      payment_mode: 'CASH',
      payable_amount: faker.finance.amount()
    }));
    return queryInterface.bulkInsert('payments', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('payments', null, {})
};
