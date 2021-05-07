module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 100).map((value, index) => ({
      name: `${`SUB_CAT_${index + 1}` + '-'}${faker.company.companySuffix()}`,
      vehicle_category_id: (index + 1) % 2 === 0 ? 1 : 2
    }));

    return queryInterface.bulkInsert('vehicle_sub_categories', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('vehicle_sub_categories', null, {})
};
