
const SET_GAME_ROOM = 'SET_GAME_ROOM'
const SET_GAME_ROOM_FULFILLED = 'SET_GAME_ROOM_FULFILLED'

const initialState = {
    room: '',
    player: ''
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case SET_GAME_ROOM:
            return {...state, room: action.payload.room, player: action.payload.player}
        default:
            return state
    }
}

export function setGameRoom(data) {
    return {
        type: SET_GAME_ROOM,
        payload: data
    }
}