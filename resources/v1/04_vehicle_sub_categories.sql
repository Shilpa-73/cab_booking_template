CREATE TABLE vehicle_sub_categories
(
    id serial NOT NULL PRIMARY KEY,
    name CHARACTER VARYING(20) NOT NULL,
    vehicle_category_id  INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamp
           WITH time zone DEFAULT NOW(),
    updated_at timestamp
           WITH time zone,
    deleted_at timestamp
           WITH time zone,
    CONSTRAINT vehicle_sub_categories_category_id FOREIGN KEY
        (vehicle_category_id) REFERENCES vehicle_categories
);


CREATE UNIQUE INDEX vehicle_sub_categories_name
ON vehicle_sub_categories(name);