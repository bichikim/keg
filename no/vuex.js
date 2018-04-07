import Vue from 'vue'
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    number: 0
  },
  mutations: {
    increase(state) {
      state.number += 1
    },
    decrease(state) {
      state.number -= 1
    }
  }
})

Vue.use(Vuex)

new Vue({
  el: '#app',
  store,
  template: '<App/>',
})

