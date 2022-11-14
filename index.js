const dotenv = require('dotenv');
dotenv.config();
const server = require('./server');

const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`Express departed from port ${port}`))

// const pokemonController = require('../controllers/pokemon')
