// import settings from '@/settings.js'
// const settings = require(process.env.NODE_ENV === 'development' ? '../../public/settings.js' : '@/settings.js')

const getDefaultState = {
  url: 'https://nane.tada.team/api/',
  wssurl: 'wss://nane.tada.team/ws',
  errorMsg: '',
  isName: false,
  isAppLoading: true,
  loading: false,
  userInfo: {
    name: null,
  },
  chatSettings: {
    max_message_length:10500,
    max_room_title_length:50,
    min_username_length:50,
    max_username_length:50,
  },
  rooms: {},
  selectedRoomName: null,
  messages: {},
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
  },
  showInfo: {
    show: false,
    color: '',
    mode: '',
    text: 'Hello, I\'m a snackbar',
    timeout: 6000,
    x: null,
    y: 'top',
  },
}

export default () => ({
  ...JSON.parse(JSON.stringify(getDefaultState)),
})
