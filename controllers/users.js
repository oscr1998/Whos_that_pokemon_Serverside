const User = require("../models/User");

async function getAllUsers(req, res) {
  try {
    let users = await User.all()
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({err})
  }
}

module.exports = { getAllUsers }

