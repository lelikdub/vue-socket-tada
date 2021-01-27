import getDefaultState from './state'
import Vue from 'vue'


export default {
  resetState (state) {
    const s = getDefaultState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
  setUserName (state, value) {
    state.userInfo.name = value
  },
  setSettings (state, value) {
    Object.keys(value).forEach(key => {
      state.chatSettings[key] = value[key]
    })
  },
  setsRooms (state, value) {
    state.rooms = [...value]
  },
  selectedRoom (state, value) {
    state.selectedRoomName = value
  },
  setRoomHistory (state, value) {
    state.messages = [...value]
  },
  setShowRoomHistory (state, value) {
    state.showHistory = value
  },
  clearRoomHistory (state) {
    state.selectedRoomName = null
    state.messages = []
  },
  SOCKET_ONOPEN (state, event)  {
    console.log('SOCKET_ONOPEN', event)
    Vue.prototype.$socket = event.currentTarget
    state.showInfo.color = 'success'
    state.showInfo.show = true
    state.showInfo.mode = false
    state.showInfo.x = 'left'
    state.showInfo.text= '✅ Socket connected!'
    state.socket.isConnected = true
    state.showHistory = false
  },
  SOCKET_ONCLOSE (state, event)  {
    state.socket.isConnected = false
    if(!state.reconnectInfo.show || !state.showHistory){
      state.reconnectInfo.show = true
      state.reconnectInfo.text = 'Соединение с сервером(' + state.wssurl + ') потеряно'
    }
    console.log('SOCKET_ONCLOSE', event)
  },
  SOCKET_ONERROR (state, event)  {
    if(!state.reconnectInfo.show || !state.showHistory) {
    state.reconnectInfo.show = true
    state.reconnectInfo.text = 'Ошибка соединения с сервером(' + state.wssurl + ')'
    console.error(state, event)
    }
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE (state, message)  {

    // state.showInfo = { color: 'success', show: true, text: 'Сообщение отправлено' }

    let roomId= state.rooms.findIndex(x => x.name === message.room)
    if(roomId>=0){
      state.rooms.splice(roomId,1,{name: message.room, last_message: message})
    } else {
      state.rooms.unshift({name: message.room, last_message: message})
    }
    if(state.selectedRoomName == message.room) {
      state.messages.push(message)
    }
    state.socket.message = message
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info(state, count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  },
}
