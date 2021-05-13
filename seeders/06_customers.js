module.exports = {
  up: (queryInterface) => {
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
      email: (faker.internet.email()).toLowerCase(),
      birth_date: faker.date.past(),
      country: faker.address.country(),
      city: faker.address.city(),
      state: faker.address.state(),
      address: faker.address.streetAddress()
    }));

    //Add one dummy customer for testing purpose
    arr.push({
      email: "chirag@gmail.com",
      first_name:"chirag",
      last_name:"test",
      mobile_no:"9978990967",
      birth_date: faker.date.past(),
      country: faker.address.country(),
      city: faker.address.city(),
      state: faker.address.state(),
      address: faker.address.streetAddress()
    })
    return queryInterface.bulkInsert('customers', arr, {});
  },
  down: (queryInterface) => queryInterface.bulkDelete('customers', null, {})
};
