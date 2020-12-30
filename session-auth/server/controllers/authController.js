const bcrypt = require("bcrypt");
const pool = require("../db");

exports.signUp = async (req, res) => {
  try {
    // Destructure req.body
    const { email, password } = req.body;

    // Check required input fields
    if (!email || !password) {
      return res.status(400).send("Please provide email and password!");
    }

    // Check password length (at least 8 characters)
    if (password.length < 8) {
      return res
        .status(400)
        .send("Please enter a password 8 characters or more!");
    }

    // Check if valid email
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (!emailRegex.test(email)) {
      return res.status(400).send("Please enter a valid email address!");
    }

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // Bcrypt the user password
    const salt = await bcrypt.genSalt(12);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // Enter the new user inside the database
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, bcryptPassword]
    );

    // Store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = newUser.rows[0].user_id;

    // Send response
    delete newUser.rows[0].password;
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    // Destructure req.body
    const { email, password } = req.body;

    // Check required input fields
    if (!email || !password) {
      res.status(400).send("Please provide your email or password!");
    }

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).send("Invalid credentials!");
    }

    // Check if password matches database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).send("Invalid credentials!");
    }

    // Store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.rows[0].user_id;
    console.log(req.session);

    // Send response without password field
    delete user.rows[0].password;

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.protect = async (req, res, next) => {
  // Get session id
  if (!req.session.userId) {
    console.log("User not authenticated");
  } else {
    console.log("User authenticated! Id is: ", req.session.userId);
  }
  next();
};
