CREATE TABLE users (
	user_id			    SERIAL,
	email			    VARCHAR(255) NOT NULL UNIQUE,
	password		    VARCHAR(255) NOT NULL,
	registration_date	TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    count               INT DEFAULT 0,
);
