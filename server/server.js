const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

const players = new Map();

io.on('connection', (socket) => {
    console.log('Игрок подключился:', socket.id)

    socket.on('playerJoin', (data) => {
        players.set(socket.id, {...data, id: socket.id})

        socket.broadcast.emit('playerJoined', {
            ...data,
            id: socket.id
        })

        socket.emit('currentPlayers', Array.from(players.values()))
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('playerLeft', socket.id);
        players.delete(socket.id);
        console.log('Игрок отключился:', socket.id)
    })

    socket.on('playerMove', (data) => {
        socket.broadcast.emit('playerMoved', {
            ...data,
            id: socket.id
        })
    })
})

const PORT = 3000
httpServer.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
