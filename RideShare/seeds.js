var mysql   = require("mysql"),
    faker   = require("faker");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'required',
    database: 'mysql',
    //debug: true
});
connection.connect();
queries = [
    'DROP DATABASE IF EXISTS rideshare',
    'CREATE DATABASE rideshare',
    'USE rideshare',
    'CREATE TABLE users ('
        + 'id INT AUTO_INCREMENT PRIMARY KEY,'
        + 'username VARCHAR(255) UNIQUE NOT NULL,'
        + 'password VARCHAR(255) NOT NULL,'
        + 'picture VARCHAR(255),'
        + 'created_at TIMESTAMP DEFAULT NOW(),'
        + 'updated_at TIMESTAMP DEFAULT NOW()'
    + ');',
    'CREATE TABLE comments('
        + 'id INT AUTO_INCREMENT PRIMARY KEY,'
        + 'comment_text TEXT NOT NULL,'
        + 'user_id INT NOT NULL,'
        + 'created_at TIMESTAMP DEFAULT NOW(),'
        + 'updated_at TIMESTAMP DEFAULT NOW(),'
        + 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
    +');',
    'CREATE TABLE rating('
        + 'rated_id INT NOT NULL,'
        + 'rater_id INT NOT NULL,'
        + 'rate TINYINT UNSIGNED NOT NULL,'
        + 'created_at TIMESTAMP DEFAULT NOW(),'
        + 'FOREIGN KEY(rated_id) REFERENCES users(id) ON DELETE CASCADE,'
        + 'FOREIGN KEY(rater_id) REFERENCES users(id) ON DELETE CASCADE,'
        + 'PRIMARY KEY(rated_id, rater_id)'
    +');',
    'CREATE TRIGGER check_rate BEFORE INSERT ON rating FOR EACH ROW '
    + 'BEGIN '
        + 'IF NEW.rate < 1 OR NEW.rate > 5 ' 
        + 'THEN SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Rate must be between 1 and 5";'
        + 'END IF;'
    + 'END;'
];

function seedDB() {

    queries.forEach(function(query) {
        connection.query(query, function (err, results) {
            if (err) throw err;
        });
    });
    console.log('db successfully created!');

    var users = [];
    for (var i = 0; i < 12; i++) {
        users.push([
            faker.internet.userName(),
            faker.internet.password(),
            faker.internet.avatar(),
            faker.date.past()
        ]);
    }

    var insertUsers = "INSERT INTO users (username, password, picture, created_at) VALUES ?";
    connection.query(insertUsers, [users], function (err, results) {
        if (err) throw err;
        console.log('user table seeded!');
    });

    var comments = [];
    var selectId = "SELECT id FROM users";
    connection.query(selectId, function (err, results) {

        for (var i = 0; i < 12; i++) {
            var id = results[Math.floor(Math.random() * i)].id;
            comments.push([
                faker.lorem.sentence(),
                id,
                faker.date.past()
            ]);
        }

        var insertComments = "INSERT INTO comments (comment_text, user_id, created_at) VALUES ?";
        connection.query(insertComments, [comments], function (err, results) {
            if (err) throw err;
            console.log('comments table seeded!');
        });
    });

}

module.exports = seedDB;
