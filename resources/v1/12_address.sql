create type address_type
    as enum('VEHICLE','DRIVER');

CREATE TABLE address
(
    id serial NOT NULL PRIMARY KEY,
    type address_type NOT NULL default 'DRIVER',
    item_id INTEGER NOT NULL, -- Might be vehicle OR Driver
    lat float8 NOT NULL,
    long float8 NOT NULL,
    created_at timestamp
           WITH time zone DEFAULT NOW
        (),
    updated_at timestamp
           WITH time zone,
    deleted_at timestamp
           WITH time zone
);


CREATE UNIQUE INDEX adress_type_item_id
ON address(type,item_id);

