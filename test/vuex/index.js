import {expect} from 'chai'
import {describe, it} from 'mocha'
import keg from '../../src/vuex/index'
describe('Keg vuex plugin', () => {
  let executeDataFromKegPlugin = null
  const kegPlugin = (options) => (store) => (mutations, state) => (executeData) => {
    executeDataFromKegPlugin = executeData
  }
  const nextHandler = keg({
    plugins: {
      kegPlugin: kegPlugin({testText: 'OK'}),
    },
  })

  it('should return a function to handle next', () => {
    expect(nextHandler).to.be.a('function')
  })
  describe('handle next', () => {
    let TypeFromCommit = null
    let DataFromCommit = null
    let KegPluginFromActionFunction = null
    let nextFromActionFunction = null
    let VuexSubscribeHandler = null
    const store = {
      subscribe: (func) => {
        VuexSubscribeHandler = func
      },
      commit: (type, data) => {
        TypeFromCommit = type
        DataFromCommit = data
      },
    }
    nextHandler(store)
    it('should register a function in subscribe of store', () => {
      expect(store.subscribe).to.be.a('function')
    })

    describe('Vuex subscribe handler', () => {
      const mutation = {
        payload: ({kegPlugin, next}) => {
          KegPluginFromActionFunction = kegPlugin
          nextFromActionFunction = next
          kegPlugin({textTest: 'OK'})
          next({textTest: 'OK'})
        },
        type: 'testType',
      }
      const state = {
        testText: 'Ok',
      }
      VuexSubscribeHandler(mutation, state)
      it('can run a payload in mutation with an object which has a next function and plugins', () => {
        expect(KegPluginFromActionFunction).to.be.a('function')
        expect(nextFromActionFunction).to.be.a('function')
      })
      describe('Payload in Mutation', () => {
        it('can run functions of next and plugins', () => {
          expect(executeDataFromKegPlugin).to.be.an('object')
          expect(TypeFromCommit).to.be.an('string')
          expect(DataFromCommit).to.be.an('object')
          expect(executeDataFromKegPlugin.textTest).to.be.an('string')
          expect(TypeFromCommit).to.equal('testType')
          expect(DataFromCommit.textTest).to.be.an('string')
          expect(executeDataFromKegPlugin.textTest).to.equal('OK')
          expect(DataFromCommit.textTest).to.equal('OK')
        })
      })
    })
  })
})

