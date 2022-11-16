const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
    cors:{
        origin: "*"
    }
})

let cors = require('cors')
app.use(cors())
app.use(express.json());

// const router = express.Router();
const usersRoutes = require("./routes/usersRoutes")
const pokemonRoute = require('./routes/pokemon')
app.get('/', (req, res) => res.send('Kakuna Matata')) 
app.use("/users", usersRoutes);
app.use('/pokemon', pokemonRoute) 

const port = process.env.PORT || 5001;
server.listen(port, () => console.log(`Express is running on port ${port}`))

const generateId = length => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
  
    let result = ''
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
  
    return result
}

io.on('connection', socket => {
    const clientsCount = io.engine.clientsCount

    // socket.emit('admin-message', 'Hi there, new friend!')
    // socket.broadcast.emit('admin-message', `A new friend has arrived!`)
    // io.emit('admin-message', `There is ${participantCount} x friend here now!`)

    console.log(`Client ${socket.id} joined. ${clientsCount} client${clientsCount > 1 ? 's' : ''} total.`)

    socket.on('disconnect', socket => { 
        console.log(`Client left. ${clientsCount} clients remaining.`)
    })

    socket.on('create-new-room', () => {
        const rooms = io.sockets.adapter.rooms
        let newCode

        do {
            newCode = generateId(5).toUpperCase()
        } while (rooms.has(newCode))

        socket.emit('created-room', { msg: `Created new room ${newCode}` })
        socket.join(newCode)
    })

    socket.on('join-existing-room', (code) => {
        const rooms = io.sockets.adapter.rooms

        if(rooms.has(code))
            socket.join(code)
        
        // console.log('This room', rooms.get(code));
        // io.to(code).emit('admin-message', `${rooms[code].size} in this room`)
    })
})

io.sockets.adapter.on('create-room', (room) => {
    const adapter = io.sockets.adapter
    
    // Checks for default room
    if(adapter.sids.has(room))
        return
    
    console.log('Created new room', room)
    // console.log('comparison', socket.id);
    // console.log(':', room)
    // if(socket.id !== room)
    //     socket.emit('created-room', { msg: `created ${room}`, code: room })
    // console.log('created', room);
    // console.log('All rooms', io.sockets.adapter.rooms);
})

io.sockets.adapter.on('delete-room', (room) => {
    io.to(room).emit('admin-message', `deleted ${room}`)
    // console.log('deleted', room);
    // console.log('All rooms', io.sockets.adapter.rooms);
})

io.sockets.adapter.on('join-room', (room, id) => {
    const adapter = io.sockets.adapter

    // Checks for default room
    if(id === room)
        return
        
    console.log(`Client ${id} joined room ${room}`)
    console.log(adapter.rooms.get(room))
    io.to(room).emit('joined-room', { msg: `joined ${room}`, code: room })
})

io.sockets.adapter.on('leave-room', (room, id) => {
    const adapter = io.sockets.adapter

    io.to(room).emit('admin-message', `Client left ${room}`)
    console.log(adapter.rooms.get(room));
    // console.log('This room', rooms.get(room));
    // console.log('All rooms', io.sockets.adapter.rooms);
})

module.exports = {app, server}