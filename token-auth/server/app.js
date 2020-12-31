require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("../server/routes/userRoutes");

const { PORT = 3000, NODE_ENV = "development" } = process.env;

const IN_PROD = NODE_ENV === "production";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
