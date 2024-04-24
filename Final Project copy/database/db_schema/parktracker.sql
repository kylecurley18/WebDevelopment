CREATE TABLE IF NOT EXISTS `users` (
    usr_id INT UNIQUE AUTO_INCREMENT,
    usr_first_name VARCHAR(255),
    usr_last_name VARCHAR(255),
    usr_username VARCHAR(255) UNIQUE,
    usr_email VARCHAR(255) UNIQUE,
    usr_salt VARCHAR(255),
    usr_password VARCHAR(255),
    usr_num_parks INT,
    PRIMARY KEY(usr_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_visited_parks (
    user_id INT,
    park_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(usr_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT,
    followed_id INT,
    FOREIGN KEY (follower_id) REFERENCES users(usr_id),
    FOREIGN KEY (followed_id) REFERENCES users(usr_id),
    UNIQUE KEY (follower_id, followed_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_datetime VARCHAR(255),
    post_text VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(usr_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;