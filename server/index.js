let express = require('express')
let app = express()
require('dotenv').config()
let massive = require('massive')
let { CONNECTION_STRING, SERVER_PORT } = process.env
let socket = require('socket.io')

app.use(express.json())

let player1 = ''

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    const io = socket(app.listen(SERVER_PORT, () => {
        console.log('Server is running on port ' + SERVER_PORT)
    }))
    
    io.on('connection', client => {
        console.log('connected')

        client.leave(client.id)

        client.on('createRoom', data => {
            let { room } = data
            client.join(room)
            io.emit('roomsGot', io.sockets.adapter.rooms)
        })

        client.on('joinRoom', data => {
            let { room } = data
            client.join(room)
        })

        client.on('startGame', data => {
            let { player1Map, room } = data
            console.log('started')
            player1 = player1Map
        })

        client.on('joinGame', async data => {
            let { player2Map, room } = data
            console.log('joined')
            io.in(room).emit('gameJoined', { player1, player2Map })
            player1 = ''
            io.emit('roomsGot', io.sockets.adapter.rooms)
        })

        client.on('changeTurns', data => {
            let { currentTurn, room } = data
            io.in(room).emit('turnsChanged', currentTurn)
        })

        client.on('leaveGame', room => {
            console.log('player left')
            client.leave(room)
            client.in(room).emit('playerLeft')
        })

        client.on('disconnect', () => {
            console.log('user disconnected')
        })

        //dashboard endpoint to get all current rooms

        client.on('getRooms', () => {
            client.emit('roomsGot', io.sockets.adapter.rooms)
            // console.log(io.rooms)
            // client.emit(io.rooms)
        })
        
    })
})