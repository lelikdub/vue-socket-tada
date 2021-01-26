import axios from 'axios'
import Vue from 'vue'


export default {
  setUserName ({ commit }, value) {
    sessionStorage.setItem('userName', value)
    commit('setUserName', value)
  },
  clearUserName ({ commit }) {
    sessionStorage.removeItem('userName')
    commit('setUserName', null)
    commit('resetState')
  },
  checkName ({ state, commit }) {
    return new Promise((resolve, reject) => {
      let userName = sessionStorage.getItem('userName')
      if(state.userInfo.name || userName) {
        resolve(userName)
        commit('setUserName',userName)
      } else {
        reject('Enter you name')
      }
    })
  },
  getSettings ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: state.url + 'settings',
        withCredentials: false,
      })
        .then((response) => {
          if (response.data) {
            console.log('Settings:', response.data)
            commit('setSettings', response.data.result)
            resolve(response.data)
          } else { throw new Error('Ошибка подключения') }
        }).catch((e) => {
          reject(e)
        })
    })
  },
  getRooms ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: state.url + 'rooms',
        withCredentials: false,
      })
        .then((response) => {
          if (response.data) {
            commit('setsRooms', response.data.result)
            resolve(response.data)
          } else { throw new Error('Ошибка подключения') }
        }).catch((e) => {
          reject(e)
        })
    })
  },
  getHistory ({ commit, state }, roomName) {
    return new Promise((resolve, reject) => {
      commit('clearRoomHistory')
      axios({
        method: 'get',
        url: state.url + 'rooms/' + roomName +'/history',
        withCredentials: false,
      })
        .then((response) => {
          if (response.data) {
            commit('selectedRoom', roomName)
            commit('setRoomHistory', response.data.result)
            resolve(response.data)
          } else { throw new Error('Ошибка подключения') }
        }).catch((e) => {
          reject(e)
        })
    })
  },
  sendMessage: function(context, message) {
    Vue.prototype.$socket.send(message)
  },
}
