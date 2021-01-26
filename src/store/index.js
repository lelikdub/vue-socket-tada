import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import getDefaultState from './state'

Vue.use(Vuex)

const state = getDefaultState()

if (module.hot) {
  module.hot.accept([
    './getters',
    './actions',
    './mutations',
  ], () => {
    store.hotUpdate({
      getters: require('./getters'),
      actions: require('./actions'),
      mutations: require('./mutations'),
    })
  })
}
const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})

export default store
