module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 100).map((value, index) => ({
      vehicle_number: `GJ-5${faker.lorem.word().substr(1, 3)}${+faker.random.number({
        min: 1004,
        max: 4000
      })}`,
      vehicle_category_id: (index + 1) % 2 === 0 ? 1 : 2,
      vehicle_sub_category_id: index + 1 > 50 ? parseInt((index + 1) / 2) : index + 1,
      amount: faker.finance.amount({
        min: 5,
        max: 20
      }),
      model_no: `${faker.lorem.word().substr(1, 3)}-${faker.lorem.word({
        min: 4,
        max: 7
      })}`,
      brand_name: `${faker.lorem.word().substr(1, 3)}-${faker.lorem.word({
        min: 4,
        max: 7
      })}`,
      manufacturing_year: faker.date
        .past()
        .toString()
        .substr('1', '4'),
      active: true
    }));
    return queryInterface.bulkInsert('vehicles', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('vehicles', null, {})
};
