var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    User                  = require("./models/user"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/carpooling");

app.use(require("express-session")({
    secret: "This is the secret message",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Landing page
app.get("/", function(req, res) {
    res.render('landing.ejs');
});

// INDEX - Show all drivers
app.get("/drivers", passport.authenticate("local", {
    successRedirect: "/drivers",
    failureRedirect: "/login"
}),function(req, res) {
    User.find({}, function(err, drivers) {
        if(err) {
            console.log(err);
        } else {
            res.render("drivers", { drivers: drivers });
        }
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
    User.register(new User({username: username}), password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        console.log("User add successfully!");
        passport.authenticate("local")(req, res, function() {
            res.redirect("/drivers");
        });
    });
});

// LOGIN - show login page
app.get("/login", function(req, res) {
    res.render('login');
});

// LOGIN - handle login page
app.post("/login", function(req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password
    };
    User.find(user, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("login");
        }
        res.redirect("/drivers");
    });
});

// Starting app
app.listen(8088, function() {
    console.log("Serving your app...");
});