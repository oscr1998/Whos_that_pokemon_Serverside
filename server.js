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
app.get('/', (req, res) => res.send('Kakuna Matata')) 
const usersRoutes = require("./routes/usersRoutes")
const pokemonRoute = require('./routes/pokemon')
app.use("/users", usersRoutes);
app.use('/pokemon', pokemonRoute) 

const port = process.env.PORT || 5001;

server.listen(port, () => console.log(`Express is running on port ${port}`))

let count = 0;

const generateId = length => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
  
    let result = ''
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
  
    return result
}

io.on('connection', socket => {
    console.log("1:", socket.id)

    const participantCount = io.engine.clientsCount


    socket.emit('admin-message', 'Hi there, new friend!')

    socket.broadcast.emit('admin-message', `A new friend has arrived!`)

    io.emit('admin-message', `There is ${participantCount} x friend here now!`)

    socket.on('request-join-room', ({roomId }) => {
        socket.emit('entry-permission', { roomId })
    })
    
    // !#########################################
    socket.emit('counter updated', count);
        socket.on('counter clicked', () => {
            count++;
            io.emit('counter updated', count);
    });

    socket.on("disconnect", socket => { 
        console.log("K bye then");
    });


    socket.on('create-new-room', () => {
        const rooms = io.sockets.adapter.rooms
        let newRoomCode

        do {
            newRoomCode = generateId(6).toUpperCase()
        } while (rooms.has(newRoomCode))

        socket.join(newRoomCode)
        socket.emit('created-room', { msg: `Created new room ${newRoomCode}` })

        //io.to(code).emit('admin-message', {message})
    })

    socket.on('join-existing-room', ({code, user}) => {
        console.log()
    })

    io.sockets.adapter.on('create-room', (room) => {
        socket.emit('created-room', { msg: `created ${room}`, code: room })
        console.log('created', room);
        console.log('All rooms', io.sockets.adapter.rooms);
    })

    io.sockets.adapter.on('delete-room', (room) => {
        socket.emit('admin-message', `deleted ${room}`)
        console.log('deleted', room);
        console.log('All rooms', io.sockets.adapter.rooms);
    })

    io.sockets.adapter.on('join-room', (room, id) => {
        socket.emit('joined-room', { msg: `joined ${room}`, code: room})
        console.log('joined', room);
        console.log('All rooms', io.sockets.adapter.rooms);
    })

    io.sockets.adapter.on('leave-room', (room, id) => {
        socket.emit('admin-message', `left ${room}`)
        console.log('left', room);
        console.log('All rooms', io.sockets.adapter.rooms);
    })
})


module.exports = {app, server}
