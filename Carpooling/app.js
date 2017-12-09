var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var drivers = [
    {firstName: "Mohammed", lastName: "Boudad"},
    {firstName: "Tahar", lastName: "Boudad"}
];

// Landing page
app.get("/", function(req, res) {
    res.render('landing.ejs');
});

// INDEX - Show all drivers
app.get("/drivers", function(req, res) {
    res.render("drivers", {drivers: drivers});
});

// REGISTER - show sign up page
app.get("/register", function(req ,res) {
    res.render("register");
});

// Starting app
app.listen(8088, function() {
    console.log("Serving your app...");
});