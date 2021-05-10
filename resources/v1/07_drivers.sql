CREATE TABLE drivers (
       id serial NOT NULL PRIMARY KEY,
       first_name CHARACTER VARYING(20) NOT NULL,
       last_name CHARACTER VARYING(20) NOT NULL,
       mobile_no CHARACTER VARYING(20) NOT NULL,
       email text ,
       birth_date timestamp WITH time zone,
       address TEXT NOT NULL,
       city TEXT NOT NULL,
       state TEXT NOT NULL,
       country TEXT NOT NULL,
       driving_license_number TEXT NOT NULL,
       active BOOLEAN NOT NULL default true,
       created_at timestamp WITH time zone DEFAULT NOW(),
       updated_at timestamp WITH time zone,
       deleted_at timestamp WITH time zone
);

CREATE UNIQUE INDEX drivers_mobile_no
ON customers(mobile_no);
CREATE INDEX drivers_email ON drivers USING btree (email);

