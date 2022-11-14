const app = require("express")();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
    cors:{
        origin: "*"
    }
})

let cors = require('cors')
app.use(cors())
// server.use(express.json());

// const router = express.Router();
app.get('/', (req, res) => res.send('Kakuna Matata')) 
const usersRoutes = require("./routes/usersRoutes")
const pokemonRoute = require('./routes/pokemon')
app.use("/users", usersRoutes);
app.use('/pokemon', pokemonRoute) 

const port = process.env.PORT || 5001;

server.listen(port, () => console.log(`Express is running on port ${port}`))



let count = 0;

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


    socket.on('create-new-room', ({roomCode, message}) => {
        console.log(`Sending '${message}' to ${roomCode}`);
        socket.join(roomCode)
        io.to(roomCode).emit('admin-message', {message})
    })
})


module.exports = {app, server}
