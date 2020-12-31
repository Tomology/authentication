const bcrypt = require("bcrypt");
const pool = require("../db");
const { sign, verify } = require("jsonwebtoken");

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

    // Create access token and refresh token using JWT, and place them in cookies
    const refreshToken = sign(
      { userId: newUser.id, count: user.count },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const accessToken = sign(
      { userId: newUser.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15min",
      }
    );

    res.cookie("refresh-token", refreshToken, {
      expire: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie("access-token", accessToken, {
      expire: 1000 * 60 * 15,
    });

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

    // Verify data

    // Send response without password field
    delete user.rows[0].password;

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createTokens = (user) => {
  const refreshToken = sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15min",
    }
  );

  return { refreshToken, accessToken };
};

const invalidateTokens = async (req, res) => {
  if (!req.userId) {
    return false;
  }

  const user = await pool.query(
    `SELECT * FROM users WHERE user_id=${req.userId}`
  );

  user.count += 1;
  await user.save(); // check if this syntax is good

  return true;
};

exports.protect = async (req, res, next) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];
  if (!refreshToken && !accessToken) {
    return next();
  }
  try {
    const accessToken = req.cookies["access-token"];
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = data.user_id;
    return next();
  } catch (err) {}
  if (!refreshToken) {
    return next();
  }

  let data;
  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return next();
  }

  const user = await pool.query(
    `SELECT * FROM users WHERE user_id=${data.userId}`
  );
  // token has been invalidated
  if (!user || user.count !== data.count) {
    return next();
  }

  const tokens = createTokens(user);
  res.cookie("refresh-token", tokens.refreshToken);
  res.cookie("access-token", tokens.accessToken);
  req.userId = user.user_id;
  next();
};
