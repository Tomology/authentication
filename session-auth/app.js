const express = require("express");
const session = require("express-session");
const db = require("./db");

const app = express();

// Middleware
app.use(express.json());

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 3000,
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "ssh!quite,it'asecret!",
  SESS_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === "production";

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: "strict",
      secure: IN_PROD,
    },
  })
);

app.listen(PORT, (req, res) => console.log(`http://localhost:${PORT}`));
