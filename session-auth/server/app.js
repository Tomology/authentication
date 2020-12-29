require("dotenv").config();
const express = require("express");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
const userRouter = require("./routes/userRoutes");

const app = express();

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 3000,
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "ssh!quite,it'asecret!",
  SESS_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === "production";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// Middleware
app.use(
  session({
    name: SESS_NAME,
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
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

app.use(express.json());

// Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
