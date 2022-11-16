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
const pokemonRoute = require('./routes/pokemon');
const User = require("./models/User");
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

class Data {
    constructor(name = '', icon = '', score = 0){
        this.name = name
        this.icon = icon
        this.score = score
    }
}

io.on('connection', socket => {
    const clientsCount = io.engine.clientsCount
    const adapter = io.sockets.adapter

    // io.emit('admin-message', `${participantCount} users online.`)

    const user = adapter.sids.get(socket.id)
    user.name = ''
    user.icon = ''
    user.score = 0

    console.log(`Client ${socket.id} joined. ${clientsCount} client${clientsCount > 1 ? 's' : ''} total.`)

    socket.on('disconnect', socket => { 
        console.log(`Client left. ${clientsCount} clients remaining.`)
    })

    socket.on('create-new-room', ({ name }) => {
        const adapter = io.sockets.adapter
        const rooms = adapter.rooms
        let newCode
        
        const user = adapter.sids.get(socket.id)
        user.name = name
        console.log('This is the host', user);

        do {
            newCode = generateId(5).toUpperCase()
        } while (rooms.has(newCode))

        socket.emit('created-room', { msg: `${name} created new room ${newCode}` })
        socket.join(newCode)
    })

    socket.on('join-existing-room', ({code, name}) => {
        const adapter = io.sockets.adapter
        const rooms = adapter.rooms
        // console.log('All rooms', rooms, code);
        
        const user = adapter.sids.get(socket.id)
        user.name = name
        console.log('This is the user', name, user);

        if(!rooms.has(code)){
            socket.emit('admin-message', 'Invalid room code')
            return
        }

        const room = rooms.get(code)

        console.log("Room has name check", room.keys())
        socket.emit('admin-message', {msg: `${[...room.keys()]}`})

        if(room.has(name)){
            socket.emit('admin-message', 'Name already taken')
            return
        }

        socket.join(code)
        console.log('This room', room);
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
    const user = adapter.sids.get(id)
    const others = [...adapter.rooms.get(room)].filter(other => other !== id)
    const members = others.map(other => {
        return adapter.sids.get(other)
    })

    // Checks for default room
    if(id === room)
        return
        
    console.log(`Client ${user.name} joined room ${room}`)
    console.log('Others', others)
    io.to(room).emit('joined-room', { msg: `joined ${room}`, code: room, user: {name: user.name}, others: members })
})

io.sockets.adapter.on('leave-room', (room, id) => {
    const adapter = io.sockets.adapter

    io.to(room).emit('admin-message', `Client left ${room}`)
    // console.log("Left room", adapter.rooms.get(room));
    // console.log('This room', rooms.get(room));
    // console.log('All rooms', io.sockets.adapter.rooms);
})

module.exports = {app, server}