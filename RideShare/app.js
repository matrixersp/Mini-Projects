var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mysql                 = require("mysql"),
    faker                 = require("faker"),
    seedDB                = require("./seeds");
    
//seedDB();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'required',
    database: 'rideshare'
    //debug: true
}); 
connection.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Landing page
app.get("/", function(req, res) {
    var totalUsers = "SELECT COUNT(*) AS count FROM users";
    connection.query(totalUsers, function(err, results) {
        if(err) throw err;
        usersCount = results[0].count;
        res.render('landing', { count: usersCount });
    });
});

 // INDEX - Show all drivers
app.get("/drivers",function(req, res) {
    var totalUsers = "SELECT COUNT(*) AS count FROM users";
    connection.query(totalUsers, function (err, results) {
        if (err) throw err;
        var count = results[0].count;
        var users = "SELECT username, picture FROM users";
        connection.query(users, function(err, results) {
            if(err) throw err;
            res.render("drivers", { drivers: results, count: count });
        });
    });
});

// REGISTER - show register page
app.get("/register", function(req ,res) {
    res.render("register");
});

// REGISTER - handle register page
app.post("/register", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user = [
        [ username, password ]
    ];
    var insertUser = 'INSERT INTO users (username, password) VALUES ?';
    connection.query(insertUser, [user], function(err, results) {
        if(err) {
            throw err;
            return res.render("register");
        }
        console.log("A new user has been add!");
        res.redirect("/drivers");
    });
});

// LOGIN - show login page
app.get("/login", function(req, res) {
    res.render('login');
});

// LOGIN - handle login page
app.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var selectUser = 'SELECT username, password FROM users '
                + 'WHERE username="' + username + '" AND password="' + password + '"';
    connection.query(selectUser, function(err, results) {
        if(err) {
            throw err;
            return res.render('login');
        }
        console.log('Logged in!');
        res.redirect('/drivers');
    });
});

// Starting app
app.listen(3000, function() {
    console.log("Server running on 3000!");
});