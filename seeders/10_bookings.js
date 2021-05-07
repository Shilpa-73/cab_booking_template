module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const today = new Date();
    const endDate = new Date(new Date().setHours(new Date().getHours() + 2));

    const arr = range(1, 100).map((value, index) => ({
      booking_type: 'DAILY_RIDE',
      source_address: faker.address.streetAddress(),
      destination_address: faker.address.streetAddress(),
      pickup_address: faker.address.streetAddress(),
      pickup_lat: faker.address.latitude(),
      pickup_long: faker.address.longitude(),

      destination_lat: faker.address.latitude(),
      destination_long: faker.address.longitude(),
      status: 'CONFIRMED',
      customer_id: index >= 50 ? parseInt(index / 2) : index + 1,
      driver_id: index >= 50 ? parseInt(index / 2) : index + 1,
      // confirmed_by: index+1,

      vehicle_id: index + 1,
      amount: faker.finance.amount(),
      start_time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
      end_time: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
    }));
    return queryInterface.bulkInsert('bookings', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('bookings', null, {})
};
