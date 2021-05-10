create type user_type
    as enum('CUSTOMER','DRIVER');
create type passport_provider_type
    as enum('GOOGLE','GITHUB','LOCAL');

CREATE TABLE passport (
 id serial NOT NULL PRIMARY KEY,
 user_type user_type NOT NULL DEFAULT 'CUSTOMER',
 provider_type passport_provider_type NOT NULL DEFAULT 'GOOGLE',
 password TEXT NOT NULL,
 service_provider_id TEXT,
 user_id INTEGER  NOT NULL,
 created_at timestamp WITH time zone DEFAULT NOW(),
 updated_at timestamp WITH time zone,
 deleted_at timestamp WITH time zone
);

CREATE UNIQUE INDEX passport_user_type
ON passport(user_type,user_id,provider_type);

