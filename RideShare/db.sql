DROP DATABASE rideshare;
CREATE DATABASE rideshare;
USE rideshare;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_text TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE rating(
    rated_id INT NOT NULL,
    rater_id INT NOT NULL,
    rate TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(rated_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(rater_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(rated_id, rater_id)
);

DELIMITER $
CREATE TRIGGER check_rate
BEFORE INSERT ON rating FOR EACH ROW
BEGIN
    IF NEW.rate < 1 OR NEW.rate > 5
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Rate must be between 1 and 5';
    END IF;
END$
DELIMITER ;