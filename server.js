const express = require('express')
const server = express()
let cors = require('cors')
server.use(cors())

server.get('/', (req, res) => {
    res.send('Kakuna Matata')
}) 

module.exports = server
