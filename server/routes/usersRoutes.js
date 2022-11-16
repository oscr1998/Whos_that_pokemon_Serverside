const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users")


router.get('/', usersControllers.getAllUsers)
router.put('/', usersControllers.update)
router.post('/', usersControllers.add)


module.exports = router;
