const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users")


router.get('/', usersControllers.getAllUsers)


module.exports = router;
