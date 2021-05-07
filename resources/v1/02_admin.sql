CREATE TABLE admin
(
    id serial NOT NULL PRIMARY KEY,
    first_name CHARACTER  VARYING(20) NOT NULL,
    last_name CHARACTER  VARYING(20) NOT NULL,
    cab_station_id  INTEGER NOT NULL,
    address text NOT NULL ,
    created_at timestamp
           WITH time zone DEFAULT NOW
        (),
    updated_at timestamp
           WITH time zone,
    deleted_at timestamp
           WITH time zone,
    CONSTRAINT cab_stations_station_id FOREIGN KEY
        (cab_station_id) REFERENCES cab_stations
);

