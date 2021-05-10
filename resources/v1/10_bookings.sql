create type booking_types
    as enum('DAILY_RIDE','OUTSTATION','RENTAL');

create type booking_status_types
    as enum('REQUESTED','CONFIRMED','NOT_AVAILABLE');


CREATE TABLE bookings (
                          id serial NOT NULL PRIMARY KEY,
                          booking_type booking_types NOT NULL default 'DAILY_RIDE',
                          source_address TEXT,
                          destination_address TEXT NOT NULL,
                          pickup_address TEXT NOT NULL,
                          pickup_lat float8 NOT NULL,
                          pickup_long float8 NOT NULL,
                          destination_lat float8 NOT NULL,
                          destination_long float8 NOT NULL,
                          status booking_status_types NOT NULL default 'REQUESTED',

                          customer_id INTEGER  NOT NULL,
                          driver_id INTEGER  ,
                          confirmed_by INTEGER  ,
                          vehicle_id INTEGER  NOT NULL,
                          amount float8 NOT NULL,

                          start_time time,
                          end_time time,

                          created_at timestamp WITH time zone DEFAULT NOW(),
                          updated_at timestamp WITH time zone,
                          deleted_at timestamp WITH time zone,
                          CONSTRAINT bookings_customer_id FOREIGN KEY
                              (customer_id) REFERENCES customers,
                          CONSTRAINT bookings_driver_id FOREIGN KEY
                              (driver_id) REFERENCES drivers,
                          CONSTRAINT bookings_vehicle_id FOREIGN KEY
                              (vehicle_id) REFERENCES vehicles,
                          CONSTRAINT bookings_confirmed_by FOREIGN KEY
                              (confirmed_by) REFERENCES admin
);



CREATE INDEX bookings_vehicle_id ON bookings USING btree (vehicle_id);
CREATE INDEX bookings_driver_id ON bookings USING btree (driver_id);
CREATE INDEX bookings_customer_id ON bookings USING btree (customer_id);