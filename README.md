![intro](./media/intro.png)
# Keg

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-keg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbichikim%2Fkeg.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbichikim%2Fkeg?ref=badge_shield)
[![Build Status](https://travis-ci.org/bichikim/keg.svg?branch=master)](https://travis-ci.org/bichikim/keg)
[![Codecov](https://img.shields.io/codecov/c/github/bichikim/keg.svg)](https://codecov.io/github/bichikim/keg)



[NPM IMAGE]:http://img.shields.io/npm/v/vuex-keg.svg?style=shield
[NPM LINK]:https://www.npmjs.org/package/vuex-keg
[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-keg.svg
[PASSING]:https://circleci.com/gh/bichikim/keg.svg?style=shield&circle-tokrn=15b2464ef42b873445eae4ea8ac5726365199a3a
[PASSING LINK]: https://circleci.com/gh/bichikim/keg

> supporting custom util plugin in Vuex.

## Installation
``
npm i -S vuex-keg
``

``
yarn add vuex-keg
``

## New Feature!
> Now keg can set many actions at ones
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
      IAmJustAction({commit}, payload) {
        commit('increase')
      },
      ...keg({
        doSayHi({justSay, commit}, payload) {
          // custom keg util
          justSay('hi', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHo: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('ho', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHa: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('ha', 'foo')
          // do mutation
          commit('increase')
        },
      })
    },
    plugins: [
      VuexKeg({
        plugins: {
          justSay: (store) => (context) => (say, yourName) => (window.console.log(`${say}!`, yourName)),
        }
      })
    ],
  }
)
```

## How to Register & Use this
### Basic
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
      doSayHi: keg(({justSayHi, commit}, payload) => {
        // custom keg util
        justSayHi('foo')
        // do mutation
        commit('increase')
      }),
    },
    plugins: [
      VuexKeg({
        plugins: {
          justSayHi: (store) => (context) => (yourPrams) => (window.console.log('hi!', yourPrams)),
        }
      })
    ],
  }
)
  // result console 'hi!, foo'
```
