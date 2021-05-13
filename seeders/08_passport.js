const bcrypt = require('bcryptjs')

let generatePassword = (password) =>
    bcrypt.genSalt(10, (err, salt) => {
      return bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        return hash
      });
    });

module.exports = {
  up: async(queryInterface) => {
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

    let dummyPassword = await generatePassword('123456')
    console.log(`password of `, dummyPassword)

    //Todo remove later
    //Do entry in passport for password purpose
    arr.push({
      user_type:  'CUSTOMER',
      user_id: 51,
      provider_type: 'LOCAL',
      password: dummyPassword
    })

    arr.push({
      user_type:  'DRIVER',
      user_id: 51,
      provider_type: 'LOCAL',
      password: dummyPassword
    })

    return queryInterface.bulkInsert('passport', arr, {});
  },
  down: (queryInterface) => queryInterface.bulkDelete('passport', null, {})
};
