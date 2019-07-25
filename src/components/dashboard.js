import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setGameRoom } from '../ducks/gameReducer'
import { withRouter } from 'react-router-dom'
import socket from './sockets'

class Dashboard extends Component {
    constructor() {
        super()

        this.state = {
            rooms: '',
            createRoomName: '',
            gameNameInput: ''

        }
    }

    componentDidMount() {
        socket.emit('getRooms')
        socket.on('roomsGot', data => {
            if (Object.keys(data).length !== 0) {
                let roomArray = []
                let initialDataArray = Object.entries(data)
                initialDataArray.map(room => {
                    let roomObject = {
                        name: room[0],
                        sockets: room[1].length
                    }
                    return roomArray.push(roomObject)
                })
                this.setState ({ rooms: roomArray })

            }
        })
    }

    nameGame = () => this.setState ({ createRoomName: !this.state.createRoomName })

    handleChange = (e) => {
        this.setState ({ gameNameInput: e.target.value })
    }

    checkGame = () => {
        let { gameNameInput } = this.state
        if (gameNameInput) {

        } else {
            alert('please enter game name.')
        }
    }

    startGame = async() => {
        let {gameNameInput} = this.state
        if (gameNameInput) {
            if (this.state.rooms) {
                this.state.rooms.map(room => {
                    if (room.name === gameNameInput) {
                       alert ('game name already exists. Please enter different name for your game.')
                    } else {
                        this.props.setGameRoom({room: gameNameInput, player: 'player1'})
                        this.props.history.push('/player')
                        socket.emit('createRoom', {room: gameNameInput})
                    }
                })
            } else {
                this.props.setGameRoom({room: gameNameInput, player: 'player1'})
                this.props.history.push('/player')
                socket.emit('createRoom', {room: gameNameInput})
            }
        } else {
            alert('please enter game name')
        }
    }

    joinGame = (room) => {
        this.props.setGameRoom({room, player: 'player2'})
        socket.emit('joinRoom', {room})
        this.props.history.push('/player')
    }
    
    showRooms = () => {
        this.componentDidMount()
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <button onClick={this.showRooms}>Dashboard</button>
                <button onClick={this.nameGame}>Start New Game</button>
                {this.state.createRoomName ? 
                    <div>
                        <input placeholder="enter game name" onChange={this.handleChange}></input>
                        <button onClick={this.startGame}>create game</button>
                    </div>
                    :
                    null
                    
                }
                { this.state.rooms ?
                    this.state.rooms.map((room, i) => {
                        if (room.sockets >= 2) {
                            return (
                                <button key={i} >Full: {room.name}</button>
                            )
                        } else {
                        return (
                            <button key={i} onClick={() => this.joinGame(room.name)}>Join: {room.name}</button>
                        )
                    }})
                :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = reduxState => {
    return {
        room: reduxState.gameReducer.room
    }
}

export default connect(mapStateToProps, {setGameRoom})(withRouter(Dashboard))