CREATE TABLE vehicle_categories
(
    id serial NOT NULL PRIMARY KEY,
    name CHARACTER VARYING(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamp
           WITH time zone DEFAULT NOW
        (),
    updated_at timestamp
           WITH time zone,
    deleted_at timestamp
           WITH time zone
);

CREATE UNIQUE INDEX vehicle_categories_name
ON vehicle_categories(name);

