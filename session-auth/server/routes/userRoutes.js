const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/").get(authController.protect, userController.getDashboard);
module.exports = router;
