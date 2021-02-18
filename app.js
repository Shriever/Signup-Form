const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/user");

const app = express();
const uri =
  "mongodb+srv://Levi:IrP9xx3nd7zisICL@cluster0.jjcfp.mongodb.net/projects?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "pug");
app.post("/signup", (req, res) => {
  UserModel.find({ username: req.body.username }, (err, user) => {
    if (err) return console.error(err);
    if (user[0]) {
      res.render("alert", {
        message: "User already exists",
      });
    }
  });
  const newUser = new UserModel(req.body);
  newUser.save((err, newUser) => {
    if (err) return console.error(err);
    res.render("alert", {
      message: "Successfully signed up",
    });
  });
  // res.send("error");
});
app.post("/login", (req, res) => {
  UserModel.find({ username: req.body.username }, (err, user) => {
    if (err) return console.error(err);
    if (user[0]) {
      if (user[0].password === req.body.password) {
        res.render("alert", { message: "Logged In! Welcome Back." });
      }
    } else {
      res.render("alert", {
        message: "Wrong username or password. Please try again.",
      });
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("form", { title: "Sign Up", action: "signup" });
});
app.get("/login", (req, res) => {
  res.render("form", { title: "Log In", action: "login" });
});
app.get("/", (req, res) => {
  res.render("index", { title: "The Hub", message: "hello there!" });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server is listening on port 3000...");
});
