const express = require('express');
const router = express.Router();
const userController = require('../controllers/users')

router.get('/', userController.getAllUsers)
// router.put('/', userController.update)

module.exports = router;
