import React, { Component } from 'react'
import { connect } from 'react-redux'
import socket from './sockets'

class Player extends Component {
    constructor() {
        super()

        this.state = {
            player1Map: '',
            player2Map: '',
            currentTurn: 'player1',
            spotSelected: ''
        }
    }

    componentDidMount() {
        if (this.props.player === 'player1') {
            this.initializePlayer1()
        } else if (this.props.player === 'player2') {
            this.initializePlayer2()
        }

        socket.on('gameJoined', data => {
            let { player1, player2Map } = data
            this.setState ({ player1Map: player1, player2Map }) 
        })

        socket.on('turnsChanged', data => {
            console.log(data)
            this.setState ({ currentTurn: data })
        })

        socket.on('playerLeft', () => alert('opponent left. game over.'))
    }

    initializePlayer1 = async() => {
        await this.setState({ player1Map: [[1,2],[3,4,5],[6,7,8],[9,10,11,12],[13,14,15,16,17]] })
        let { player1Map } = this.state
        let { room } = this.props
        socket.emit('startGame', { player1Map, room })
    }

    initializePlayer2 = async() => {
        await this.setState ({ player2Map: [[18,19],[20,21,22],[23,24,25],[26,27,28,29],[30,31,32,33,34]] })
        let { player2Map } = this.state
        let { room } = this.props
        socket.emit('joinGame', {player2Map, room})
    }

    handleChange = e => {
        this.setState ({ spotSelected: e.target.value})
    }

    makeMove = async() => {
        let { player1Map, player2Map, spotSelected } = this.state
        if (this.state.currentTurn === 'player1') {

            player2Map.map(ship => {
                ship.map((position) => {
                    if (position === +spotSelected ) {
                        console.log('hit!')
                    } 
                })
            })
            await this.setState ({ currentTurn: 'player2'})
        } else {
            player1Map.map(ship => {
                ship.map(position => {
                    if (position === +spotSelected ) {
                        console.log('Hit!')
                    }
                })
            })
            await this.setState ({ currentTurn: 'player1'})
        }
        let { room } = this.props
        let { currentTurn } = this.state
        socket.emit('changeTurns', {currentTurn, room})
    }

    leaveGame = () => {
        let { room } = this.props
        socket.emit('leaveGame', room)
        this.props.history.push('/')
    }

    render() {
        console.log(this.state)
        return (
            <div>
                {this.state.player2Map ?
                    <h1>Opponent Connected</h1>
                :
                    <h1>Waiting for opponent</h1>
                }
                {this.state.currentTurn === this.props.player ?
                    <div>
                        <input type="number" placeholder="enter number 1-100" onChange={this.handleChange}/>
                        <button onClick={this.makeMove}>make a move</button>
                        <div>Your Turn</div>
                    </div>
                    :
                    <div>Opponent's turn</div>
                }
                <button onClick={this.leaveGame}>Leave Game</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => {
    return {
        room: reduxState.gameReducer.room,
        player: reduxState.gameReducer.player
    }
}

export default connect(mapStateToProps)(Player)