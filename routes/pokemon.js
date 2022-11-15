const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon')

router.get('/:range', pokemonController.index)
router.get('/:name', pokemonController.show)

module.exports = router
