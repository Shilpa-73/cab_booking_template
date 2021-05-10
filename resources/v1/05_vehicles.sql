CREATE TABLE vehicles
(
    id serial NOT NULL PRIMARY KEY,
    vehicle_number CHARACTER  VARYING(20) NOT NULL,
    vehicle_category_id  INTEGER NOT NULL,
    vehicle_sub_category_id  INTEGER NOT NULL,
    amount float8 NOT NULL,
    model_no text NOT NULL,
    brand_name text NOT NULL,
    manufacturing_year CHARACTER  VARYING(4) NOT NULL,
    active BOOLEAN NOT NULL default true,
    created_at timestamp
    WITH time zone DEFAULT NOW(),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT vehicle_categories_category_id FOREIGN KEY
        (vehicle_category_id) REFERENCES vehicle_categories,
    CONSTRAINT vehicle_sub_categories_category_id FOREIGN KEY
        (vehicle_sub_category_id) REFERENCES vehicle_sub_categories
);

