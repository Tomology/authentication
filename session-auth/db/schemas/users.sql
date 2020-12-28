CREATE TABLE users (
	user_id			    SERIAL,
	email			    VARCHAR(255) NOT NULL UNIQUE,
	password		    VARCHAR(255) NOT NULL,
	registration_date	TIMESTAMP(0) NOT NULL DEFAULT NOW(),
);

-- The below password length constraint will not work 
-- because the password is hashed prior to being stored in the db. 
-- The hashed passwords length will always be above 7.
-- password VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(password) >= 8)