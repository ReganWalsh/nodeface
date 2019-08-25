const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();

router.post("/signup", UserController.createUser); //Creates A User
router.post("/login", UserController.userLogin); //Logs In A Particular User

module.exports = router;
