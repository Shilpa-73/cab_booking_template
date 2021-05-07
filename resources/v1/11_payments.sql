create type payment_mode
    as enum('CASH','CREDIT_CARD','DEBIT_CARD');
CREATE TABLE payments (
                                     id serial NOT NULL PRIMARY KEY,
                                     booking_id INTEGER  NOT NULL,
                                     payment_mode payment_mode NOT NULL default 'CASH',
                                     payment_meta TEXT,
                                     payable_amount float8 NOT NULL,
                                     created_at timestamp WITH time zone DEFAULT NOW(),
                                     updated_at timestamp WITH time zone,
                                     deleted_at timestamp WITH time zone,
                                     CONSTRAINT payments_booking_id FOREIGN KEY
                                         (booking_id) REFERENCES bookings
);
