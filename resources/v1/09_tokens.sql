CREATE TABLE tokens (
                          id serial NOT NULL PRIMARY KEY,
                          type user_type NOT NULL DEFAULT 'CUSTOMER', --Customer OR driver
                          token TEXT NOT NULL,
                          token_expiry timestamp with time zone NOT NULL,
                          login_time timestamp with time zone NOT NULL,
                          logout_time timestamp with time zone NOT NULL,
                          user_id INTEGER  NOT NULL,
                          created_at timestamp WITH time zone DEFAULT NOW(),
                          updated_at timestamp WITH time zone,
                          deleted_at timestamp WITH time zone
);

CREATE INDEX tokens_token ON tokens USING btree (token);

