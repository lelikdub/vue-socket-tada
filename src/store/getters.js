export default {
  url: state => {
    return state.url
  },
  wssurl: state => {
    return state.wssurl
  },
  isAppLoading: state => {
    return state.isAppLoading
  },
  isConnected: state => {
    return state.socket.isConnected
  },
  isConnecting: state => {
    return !state.socket.isConnected
  },
  showInfo: state => {
    return state.showInfo
  },
  reconnectInfo: state => {
    return state.reconnectInfo
  },
  showHistory: state => {
    return state.showHistory
  },
  userInfo: state => {
    return state.userInfo
  },
  minNamelength: state => {
    return state.chatSettings.min_username_length
  },
  maxNamelength: state => {
    return state.chatSettings.max_username_length
  },
  maxRoomNamelength: state => {
    return state.chatSettings.max_room_title_length
  },
  maxMessageLength: state => {
    return state.chatSettings.max_message_length
  },
  rooms: state => {
    return state.rooms
  },
  selectedRoomName: state => {
    return state.selectedRoomName
  },
  selectedRoomMessages: state => {
    return state.messages
  },
}
