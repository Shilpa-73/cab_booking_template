CREATE TABLE cab_stations
(
    id serial NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    lat float8 NOT NULL,
    long float8 NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at timestamp
           WITH time zone DEFAULT NOW
        (),
    updated_at timestamp
           WITH time zone,
    deleted_at timestamp
           WITH time zone
);

