const express = require("express");

const { PORT = 3000, NODE_ENV = "development" } = process.env;

const IN_PROD = NODE_ENV === "production";

const app = express();

app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
