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

const adapter = io.sockets.adapter
const getRoom = roomId => adapter.rooms.get(roomId)
const getUser = userId => adapter.sids.get(userId)
const getSocket = sid => io.sockets.sockets.get(sid)

io.on('connection', socket => {
    const clientsCount = io.engine.clientsCount

    // io.emit('admin-message', `${participantCount} users online.`)

    socket.data.name = ''
    socket.data.icon = ''
    socket.data.room = ''
    socket.data.isHost = false
    socket.data.score = 0
    socket.data.index = 0

    console.log(`Client ${socket.id} joined. ${clientsCount} client${clientsCount > 1 ? 's' : ''} total.`)

    socket.on('disconnect', socket => { 
        console.log(`Client left. ${clientsCount} clients remaining.`)
    })

    socket.on('chat-message', ({ room, message }) => {
        const user = getUser(socket.id)
        console.log('ROOM, MSG, USER', room, message, socket.data)

        if(room)
            io.to(room).emit('new-message', {user, msg: message})
        else
            io.emit('new-message', {user, msg: message})
    })

    socket.on('start-game', (room) => {
        io.to(room).emit('started-game')
        console.log('Game started')

        // socket.emit('startGame')
        // socket.broadcast.emit('startGame')
        // console.log("room", room)
        // console.log("user", user)
    })

    socket.on('set-generation', ({gen, room}) => {
        const adapter = io.sockets.adapter
        const user = adapter.sids.get(socket.id)
        const rooms = adapter.rooms
        io.to(room).emit('setting-generation', { gen })
        console.log("############## RECIEVED", gen)
        console.log(`${room} = ROOM`)
    })


    socket.on('update-score', ({ room, score }) => {
        // const user = getUser(socket.id)
        // const room = getRoom(user.room)

        socket.data.score += score

        io.to(room).emit('updated-score', { user: {...socket.data, score: socket.data.score }})

        console.log("UPDATE SCORE", `${socket.data.name} scored ${score} [${socket.data.score} total]`)
    })

    socket.on('create-new-room', ({ name, icon }) => {
        socket.data.name = name
        socket.data.icon = icon
        socket.data.isHost = true

        let newCode
        do {
            newCode = generateId(5).toUpperCase()
        } while (adapter.rooms.has(newCode))

        console.log(`${socket.data.name} created room ${newCode}`)
        socket.emit('created-room', { msg: `${name} created new room ${newCode}` })
        socket.join(newCode)
    })

    socket.on('join-existing-room', ({ room, name, icon }) => {
        // const adapter = io.sockets.adapter
        // console.log('All rooms', rooms, code);
        
        // const user = getUser(socket.id)
        // user.name = name
        // console.log('This is the user', name, user);

        if(!adapter.rooms.has(room)){
            socket.emit('admin-message', 'Invalid room code')
            return
        }

        socket.data.name = name
        socket.data.room = room
        socket.data.icon = icon
        socket.join(room)

        console.log(`${name} joined ${room}`)
        socket.to(room).emit('user-joined', { user: socket.data })

        // const room = rooms.get(code)

        // console.log("Room has name check", room.keys())
        // socket.emit('admin-message', {msg: `${[...room.keys()]}`})

        // if(room.has(name)){
        //     socket.emit('admin-message', 'Name already taken')
        //     return
        // }

        // console.log('This room', room);
        // io.to(code).emit('admin-message', `${rooms[code].size} in this room`)
    })

    socket.on('leave-current-room', (code) => {
        console.log('LEAVE ROOM', socket.id, code);

        socket.data.room = ''
        socket.data.score = 0
        socket.leave(code)
    })
})



io.sockets.adapter.on('create-room', (room) => {
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
    // Checks for default room
    if(id === room)
        return
    
    const socket = getSocket(id)
    const users = [...getRoom(room)].map(user => getSocket(user).data)
    // const others = [...getRoom(room)].filter(other => other !== id)
    // const members = others.map(other => adapter.sids.get(other))

    socket.data.room = room
    socket.data.index = users.length

    // console.log('User data', user)
    console.log(`Client ${socket.data.index} ${socket.data.name} joined room ${room}`)
    console.log('All users', users)

    io.to(room).emit('joined-room', { msg: `joined ${room}`, code: room, user: socket.data, users })
})

io.sockets.adapter.on('leave-room', (room, id) => {
    const socket = getSocket(id)

    console.log(`${socket.data.name} left ${room}`)
    io.to(room).emit('admin-message', `${socket.data.name} left ${room}`)
    // console.log("Left room", adapter.rooms.get(room));
    // console.log('This room', rooms.get(room));
    // console.log('All rooms', io.sockets.adapter.rooms);
})

module.exports = {app, server}
