![intro](./img/intro.png)
# Keg

[![NPM Version][NPM IMAGE]][NPM LINK]
[![LICENSE][LICENSE IMAGE]][LICENSE LINK]

[NPM IMAGE]:http://img.shields.io/npm/v/vuex-keg.svg?style=flat
[NPM LINK]:https://www.npmjs.org/package/vuex-keg
[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-keg.svg
[LICENSE LINK]:https://www.npmjs.org/package/vuex-keg

> Vuex plugin. It can run a payload function in Mutation Commit

## Installation
``
npm i -S vuex-keg
``

``
yarn add vuex-keg
``
## How to Register & Use this
````javascript
import Vue from 'vue'
import Vuex from 'vuex'
import keg from './index'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
      //...
    },
    actions: {
      doSayHi({commit}, data){
        commit('doSayHi', ({justSayHi, next}) => {
          // do the function
          justSayHi('foo')
          // do mutation with data 
          next({foo: 'yeah!'})
        })
      }
    },
    plugins: [keg({
      plugins: {
        justSayHi: (store) => (mutation, state) => (yourPrams) => (window.console.log('hi!', yourPrams)),
      },
    })],
  })
  // result mutation: {type: 'doSayHi', payload: {foo: 'yeah!'}}
  // result console 'hi!, foo'
````