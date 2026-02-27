DROP TABLE Users;

CREATE TABLE Users(
    id BIGINT PRIMARY KEY,
    username VARCHAR(10),
    email VARCHAR(20),
    hashPassword VARCHAR,
    createdAt timestamp
)