CREATE TABLE customers (
    id serial NOT NULL PRIMARY KEY,
    first_name CHARACTER VARYING(20) NOT NULL,
    last_name CHARACTER VARYING(20) NOT NULL,
    mobile_no CHARACTER VARYING(20) NOT NULL,
    email text ,
    birth_date timestamp WITH time zone,
    address TEXT NULL,
    city TEXT NULL,
    state TEXT NULL,
    country TEXT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone
);

CREATE UNIQUE INDEX customer_mobile_no
ON customers(mobile_no);
CREATE INDEX customer_email ON customers USING btree (email);

