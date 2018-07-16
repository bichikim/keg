![intro](./media/intro.png)
# Vuex Keg
> A container plugin for Vuex\

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-keg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbichikim%2Fkeg.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbichikim%2Fkeg?ref=badge_shield)
[![Build Status](https://travis-ci.org/bichikim/keg.svg?branch=master)](https://travis-ci.org/bichikim/keg)
[![Codecov](https://img.shields.io/codecov/c/github/bichikim/keg.svg)](https://codecov.io/github/bichikim/keg)



[NPM IMAGE]:http://img.shields.io/npm/v/vuex-keg.svg?style=shield
[NPM LINK]:https://www.npmjs.org/package/vuex-keg
[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-keg.svg
[PASSING]:https://circleci.com/gh/bichikim/keg.svg?style=shield&circle-tokrn=15b2464ef42b873445eae4ea8ac5726365199a3a
[PASSING LINK]: https://circleci.com/gh/bichikim/keg

> Using Redux? see redux-keg (working on it)

``
$ npm i -S vuex-keg
``

``
$ yarn add vuex-keg
``

## Why Do I Need This?
Vuex context has only {dispatch, commit, state, getters, rootState, rootGetters}\
Vuex-keg is a solution to add more **your functions** for vuex

## Why Should I Add More functions?
You may need a function that processes repetitve code.
```javascript
const actions = {
  myAction({commit, dispatch}, payload){
    if(payload === 'tree'){
      // do1, do2, ...
    }
    if(payload === 'sky'){
      // do1 
      commit(payload)
    }
    // ...
    dispatch('more thee')
  },
  myAction2({commit}){
    if(payload === 'tree'){
      // do1, do2, ...
    }
    if(payload === 'sky'){
      // do1 
      commit(payload)
    }
     commit('tree')
  }
}
```
Why don't you make and add a function for it
```javascript
import {keg} from './src' 
const action = {
  ...keg({
    myAction({commit, dispatch, myUtil}, payload){
      myUtil()
      dispatch('more thee')
    },
    myAction2({commit, myUtil}, payload){
      myUtil()
      commit('tree')
    }
  })
}
```

## How to Register & Use
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexKeg, {keg} from './'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutation: {
      increase(state) {
        state.count += 1
      },
    },
    actions: {
      IAmJustAnAction({commit}, payload) {
        commit('increase')
      },
      // support single runing with a name parm
      doSayHum: keg(({justSay}, payload) => {
        justSay('Hum', 'foo')
      }, {}, 'doSayHum'),
      // New Feature 
      // Now keg can set many actions at ones
      ...keg({
        doSayHi({justSay, commit}, payload) {
          // custom keg util
          justSay('Hi', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHo: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('Ho', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHa: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('Ha', 'foo')
          // do mutation
          commit('increase')
        },
      }, {
         pluginOptions: {
           justSay: 'anyOptions' // now Keg can send options for plugins
         }
      }),
      // now Keg can hook of an Action before the Action is run or after the Action is run [^1.2.1]
      ...keg({
        hookTest: (context, payload) => {
          console.log(payload) // 'brforeHook/[payload]'
          return payload
        } // action result is 'afterHook/brforeHook/[payload]'
      }, {
        // shouldHave: ... // ignore except/ only options
        beforeAction: ['beforeHook'], // can be array, It will run all plugins orderly
        afterAction: 'afterHook', // can be string
      })
    },
    plugins: [
      VuexKeg({
        plugins: {
          justSay: (store) => (context, payload, options) => (say, yourName) => (window.console.log(`${say}!`, yourName, options)),
          beforeHook: (store) => (context, payload) => (param /*payload*/) => (`beforeHook/${param}`),
          afterHook: (store) => (context, payload) => (param /*result*/) => (`afterHook/${param}`)
        },
        // beforeAction: ...
        // afterAction: ...
      })
    ],
  }
)
```
