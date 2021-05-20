import range from 'lodash/range';
import faker from 'faker';

export const cabStationsTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  name: faker.company.companyName(),
  lat: faker.address.latitude(),
  long: faker.address.latitude(),
  country: faker.address.country(),
  city: faker.address.city(),
  state: faker.address.state(),
  address: faker.address.streetAddress()
}));

export const adminTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  cabStationId: index + 1,
  address: faker.address.streetAddress()
}));

export const vehicleCategoriesTable = range(1, 3).map((value, index) => ({
  id: (index + 1).toString(),
  name: value === 1 ? 'CAB' : 'AUTO'
}));

export const vehicleSubCategoriesTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  name: `${`SUB_CAT_${index + 1}` + '-'}${faker.company.companySuffix()}`,
  vehicleCategoryId: (index + 1) % 2 === 0 ? 1 : 2
}));

export const vehiclesTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  vehicleNumber: `GJ-5${faker.lorem.word().substr(1, 3)}${+faker.random.number({
    min: 1004,
    max: 4000
  })}`,
  ownerId: 1,
  vehicleCategoryId: (index + 1) % 2 === 0 ? 1 : 2,
  vehicleSubCategoryId: index + 1 > 50 ? parseInt((index + 1) / 2) : index + 1,
  amount: 10,
  modelNo: `${faker.lorem.word().substr(1, 3)}-${faker.lorem.word({
    min: 4,
    max: 7
  })}`,
  brandName: `${faker.lorem.word().substr(1, 3)}-${faker.lorem.word({
    min: 4,
    max: 7
  })}`,
  manufacturingYear: faker.date.past().toString().substr('1', '4'),
  active: true
}));

export const customersTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  mobileNo:
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
  email: faker.internet.email().toLowerCase(),
  birthDate: faker.date.past(),
  country: faker.address.country(),
  city: faker.address.city(),
  state: faker.address.state(),
  address: faker.address.streetAddress()
}));

export const driversTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  mobileNo:
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
  email: faker.internet.email().toLowerCase(),
  birthDate: faker.date.past(),
  country: faker.address.country(),
  city: faker.address.city(),
  state: faker.address.state(),
  address: faker.address.streetAddress(),
  drivingLicenseNumber: faker.random.number(),
  active: true
}));

let customerId = 1;
let driverId = 1;
export const passportTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  userType: index >= 10 ? 'CUSTOMER' : 'DRIVER',
  userId: index >= 10 ? customerId++ : driverId++,
  providerType: 'LOCAL',
  password: `$2a$10$DyYRW69h7MESQ4yNMHkHI.CcxNGxPajy8KAv6ZQSbwrMkrbwSnJTW`
}));

customerId = 1;
driverId = 1;
export const tokenTable = range(1, 20).map((value, index) => ({
  id: (index + 1).toString(),
  type: index >= 10 ? 'CUSTOMER' : 'DRIVER',
  userId: index >= 10 ? customerId++ : driverId++,
  token_expiry: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
  login_time: new Date(),
  logout_time: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
}));

const today = new Date();
const endDate = new Date(new Date().setHours(new Date().getHours() + 2));
export const bookingTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  bookingType: 'DAILY_RIDE',
  sourceAddress: faker.address.streetAddress(),
  destinationAddress: faker.address.streetAddress(),
  pickupAddress: faker.address.streetAddress(),
  pickupLat: faker.address.latitude(),
  pickupLong: faker.address.longitude(),

  destinationLat: faker.address.latitude(),
  destinationLong: faker.address.longitude(),
  status: 'CONFIRMED',
  customerId: index + 1,
  driverId: index + 1,
  // confirmed_by: index+1,

  vehicleId: index + 1,
  amount: faker.finance.amount(),
  startTime: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
  endTime: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
}));

export const paymentTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  bookingId: index + 1,
  paymentMode: 'CASH',
  payableAmount: faker.finance.amount()
}));

export const addressTable = range(1, 10).map((value, index) => ({
  id: (index + 1).toString(),
  itemId: index + 1,
  type: 'VEHICLE',
  lat: faker.address.latitude(),
  long: faker.address.longitude()
}));

export const DB_ENV = {
  POSTGRES_HOST: 'host',
  POSTGRES_USER: 'user',
  POSTGRES_PASSWORD: 'password',
  POSTGRES_DB: 'table'
};
