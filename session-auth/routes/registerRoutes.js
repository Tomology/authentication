const express = require("express");
const bcrypt = require("bcrypt");
const Pool = require("../db");

const router = express.Router();

router.route("/register").post(async (req, res) => {
  try {
    // Destructure the req.body (email, password)
    const { email, password } = req.body;
    // Check if user exists (if user exists then throw error)
    const user = await Pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }
    // Bcrypt the user password
    const salt = await bcrypt.genSalt(10);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // Enter the new user inside the database
    const newUser = await Pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, bcryptPassword]
    );

    res.json(newUser.rows[0]);
    // Generating our session
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
