const User = require("../models/User");

async function getAllUsers (req, res) {
  try {
    let users = await User.all()
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({err})
  }
}

async function update (req, res) {
  try {
    const {winner, loser} = req.body
    let users = await User.update(winner, loser)
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({err})
    console.log('failed')
  }
}

async function add (req, res) {
  try {
    const user = req.body
    let users = await User.add(user)
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({err})
    console.log('failed')
  }
}

module.exports = { getAllUsers, update, add }

