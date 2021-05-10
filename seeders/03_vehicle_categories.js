module.exports = {
  up: queryInterface => {
    const range = require('lodash/range');

    const arr = range(1, 3).map((value, index) => ({
      name: value === 1 ? 'CAB' : 'AUTO'
    }));
    return queryInterface.bulkInsert('vehicle_categories', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('vehicle_categories', null, {})
};
