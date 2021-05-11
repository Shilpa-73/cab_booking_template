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

-- Create distance difference calculating function!
CREATE OR REPLACE FUNCTION distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT) RETURNS FLOAT AS $$
DECLARE
x float = 69.1 * (lat2 - lat1);
    y float = 69.1 * (lon2 - lon1) * cos(lat1 / 57.3);
BEGIN
RETURN sqrt(x * x + y * y);
END
$$ LANGUAGE plpgsql;