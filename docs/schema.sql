CREATE TABLE roles(
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR(60) NOT NULL,
email VARCHAR(200) NOT NULL UNIQUE CHECK(email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
password VARCHAR(200) NOT NULL,
address VARCHAR(400),
role_id INTEGER NOT NULL REFERENCES roles(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores(
id SERIAL PRIMARY KEY,
name VARCHAR(60) NOT NULL CHECK (LENGTH(name)>=20 AND LENGTH(name)<=60),
email VARCHAR(200) NOT NULL UNIQUE CHECK(email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
address VARCHAR(400),
store_owner_id INTEGER REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings(
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id),
store_id INTEGER NOT NULL REFERENCES stores(id),
rating INTEGER NOT NULL CHECK (rating >=1 AND rating <=5),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE (user_id, store_id)
);


INSERT INTO roles(name) VALUES('system_administrator'),('user'),('store_owner');