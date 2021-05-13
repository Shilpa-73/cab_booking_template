import moment from 'moment';

export const tables = {
  admin: 'admin',
  cabStations: 'cabStations',
  vehicles: 'vehicles',
  bookings: 'bookings',
  vehicleCategories: 'vehicle_categories',
  vehicleSubCategories: 'vehicle_sub_categories',
  customers: 'customers',
  drivers: 'drivers',
  passport: 'passport',
  tokens: 'tokens',
  payments: 'payments',
  address: 'address'
};

const unUsed = {


  a: '3'
};

console.log(`temp adatatta is`);

export const BOOKING_STATUS = {
  REQUESTED: 'REQUESTED',
  CAB_ASSIGNED: 'CAB_ASSIGNED',
  CONFIRMED: 'CONFIRMED',
  NOT_AVAILABLE: 'NOT_AVAILABLE'
};

export const USER_TYPE = {
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN'
};

export const ADDRESS_TYPE = {
  DRIVER: 'DRIVER',
  VEHICLE: 'VEHICLE'
};
