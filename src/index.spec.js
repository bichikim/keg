/* eslint-disable max-nested-callbacks */
import vuexKeg, {keg, Keg, sKeg} from './index'
import Vuex from 'vuex'
import Vue from 'vue'

describe('Keg', function() {
  Vue.config.productionTip = false
  Vue.config.devtools = false
  // just for skipping throwing error from Vuex
  Vue.use(Vuex)
  let receive
  let receiveContext
  let receiveTestSuccess
  let receiveTestFailure
  let store
  const plugins = [
    vuexKeg({
      plugins: {
        test: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {
                store,
                context,
                payload,
                prams,
              }
            }
          }
        },
        forExcept: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {
                store,
                context,
                payload,
                prams,
              }
            }
          }
        },
        forRunTimePluginOptions: (store) => {
          return (context, payload, runtimeOptions) => {
            return (prams) => {
              receive = {
                store,
                context,
                payload,
                prams,
                runtimeOptions,
              }
            }
          }
        },
      },
      beers: {
        forOnly: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {
                store,
                context,
                payload,
                prams,
              }
            }
          }
        },
      },
    })]
  const actions = {
    test: (context) => {
      receiveContext = context
      const {test} = context
      test('prams')
    },
    testOnly: (context) => {
      receiveContext = context
      const {forOnly} = context
      forOnly('prams')
    },
    testExcept: (context) => {
      receiveContext = context
      const {test} = context
      test('prams')
    },
    testExceptAndOnly: (context) => {
      receiveContext = context
      const {forOnly} = context
      forOnly('prams')
    },
    testResolveSuccess: (context) => {
      receiveContext = context
      const {test} = context
      test('prams')
      return Promise.resolve('success')
    },
    testResolveFailure: (context) => {
      receiveContext = context
      const {test} = context
      test('prams')
      return Promise.reject('failure')
    },
  }

  describe('keg', () => {
    beforeEach(() => {
      receive = null
      receiveContext = null
      store = null
      store = new Vuex.Store({
        strict: true,
        state: {
          value: 1,
        },
        actions: {
          test: keg(actions.test),
          testOnly: keg(actions.testOnly, {only: ['forOnly']}),
          testExcept: keg(actions.testExcept, {except: ['forExcept']}),
          testExceptAndOnly: keg(actions.testExceptAndOnly, {
            only: ['forOnly'], except: ['forExcept'],
          }),
          testExceptOnlyAndShouldHave: keg(actions.test, {
            only: ['forOnly'], except: ['forExcept'], shouldHave: ['test'],
          }),
        },

        plugins,
      })
    })
    afterEach(() => {
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receive.store).to.deep.equal(store)
      expect(receive.store[sKeg]).to.be.an('object')
      expect(receive.context.dispatch).to.equal(store.dispatch)
      expect(receive.context.commit).to.equal(store.commit)
      expect(receive.context.state).to.deep.equal(store.state)
      expect(receive.context.rootState).to.deep.equal(store.state)
      expect(receive.context.getters).to.deep.equal(store.getters)
      expect(receive.context.rootGetters).to.deep.equal(store.getters)
      expect(receiveContext.dispatch).to.equal(store.dispatch)
      expect(receiveContext.commit).to.equal(store.commit)
      expect(receiveContext.state).to.deep.equal(store.state)
      expect(receiveContext.rootState).to.deep.equal(store.state)
      expect(receiveContext.getters).to.deep.equal(store.getters)
      expect(receiveContext.rootGetters).to.deep.equal(store.getters)
    })
    it('should run a keg plugin', () => {
      store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should run a keg plugin: only', () => {
      store.dispatch('testOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect', () => {
      store.dispatch('testExcept', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect & only', () => {
      store.dispatch('testExceptAndOnly', 'payload')
      expect(receiveContext.test).to.be.a('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect & only & shouldHave', () => {
      store.dispatch('testExceptOnlyAndShouldHave', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
  })

  describe('keg mapping', () => {
    beforeEach(() => {
      receive = null
      receiveContext = null
      store = null
      const {testOnly, testExcept, testExceptAndOnly} = actions
      store = new Vuex.Store({
        strict: true,
        state: {
          value: 1,
        },
        actions: {
          test: keg(actions.test),
          ...keg({
            testOnly,
            testExcept,
            testExceptAndOnly,
          }),
        },
        plugins,
      })
    })
    it('should return object to map 1', () => {
      store.dispatch('testOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
    })
    it('should return object to map 2', () => {
      store.dispatch('testExcept', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
    })
    it('should return object to map 3', () => {
      store.dispatch('testExceptAndOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
    })
  })
  /*********************************
   * Keg class
   ********************************/
  describe('Keg class', () => {
    let keg
    const makeStore = (keg) => {
      store = new Vuex.Store({
        strict: true,
        state: {
          value: 1,
        },
        actions: {
          test: keg.tap(actions.test),
          testOnly: keg.tap(actions.testOnly),
          testExcept: keg.tap(actions.testExcept),
          testExceptAndOnly: keg.tap(actions.testExceptAndOnly, {
            only: ['forOnly'], except: ['forExcept'],
          }),
          testResolveSuccess: keg.tap(actions.testResolveSuccess, {}, 'test'),
          testResolveFailure: keg.tap(actions.testResolveFailure, {}, 'test'),
        },
        mutations: {
          testFailure(state, payload) {
            console.log('dd', payload)
            receiveTestFailure = payload
          },
          testSuccess(state, payload) {
            receiveTestSuccess = payload
          },
        },
        plugins,
      })
    }
    beforeEach(() => {
      receive = null
      receiveContext = null
      store = null
      receiveTestSuccess = null
      receiveTestFailure = null
    })
    afterEach('instance as members', () => {
      expect(keg).to.be.an('object')
      expect(keg._options).to.be.an('object')
      expect(keg.tap).to.be.an('function')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receive.store).to.deep.equal(store)
      expect(receive.context.dispatch).to.equal(store.dispatch)
      expect(receive.context.commit).to.equal(store.commit)
      expect(receive.context.state).to.deep.equal(store.state)
      expect(receive.context.rootState).to.deep.equal(store.state)
      expect(receive.context.getters).to.deep.equal(store.getters)
      expect(receive.context.rootGetters).to.deep.equal(store.getters)
      expect(receiveContext.dispatch).to.equal(store.dispatch)
      expect(receiveContext.commit).to.equal(store.commit)
      expect(receiveContext.state).to.deep.equal(store.state)
      expect(receiveContext.rootState).to.deep.equal(store.state)
      expect(receiveContext.getters).to.deep.equal(store.getters)
      expect(receiveContext.rootGetters).to.deep.equal(store.getters)
    })
    it('should create an instance without arguments', () => {
      keg = new Keg()
      makeStore(keg)
      store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only', () => {
      keg = new Keg({only: ['forOnly']})
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : except', () => {
      keg = new Keg({except: ['forExcept']})
      makeStore(keg)
      store.dispatch('testExcept', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only & except', () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
      })
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.a('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only & except & shouldHave', () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
        shouldHave: ['test'],
      })
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : resolve success', (done) => {
      keg = new Keg({
        resolve: true,
      })
      makeStore(keg)
      const promise = store.dispatch('testResolveSuccess', 'payload')
      promise.then(() => {
        expect(receiveTestSuccess).to.equal('success')
        done()
      }).catch((e) => {
        done(e)
      })
    })
    it('should create an instance : resolve failure', (done) => {
      keg = new Keg({
        resolve: true,
      })
      makeStore(keg)
      const promise = store.dispatch('testResolveFailure', 'payload')
      promise.catch(() => {
        console.log('receiveTestFailure', receiveTestFailure)
        expect(receiveTestFailure).to.equal('failure')
        done()
      }).catch((e) => {
        done(e)
      })
    })
    it('can change default options', () => {
      keg = new Keg({only: ['forOnly'], except: ['forExcept']})
      makeStore(keg)
      // change options
      keg.options = {only: ['forOnly']}
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can get options', () => {
      keg = new Keg({only: ['forOnly'], except: ['forExcept']})
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(keg.options).to.deep.equal({
        only: ['forOnly'],
        except: ['forExcept'],
      })
    })
  })

  describe('keg without init keg plugins', () => {
    const store = new Vuex.Store({
      strict: true,
      state: {value: 1},
      actions: {test: keg(actions.test)},
    })
    it('should throw error when store has no keg-plugin', () => {
      const error = () => {store.dispatch('test', 'payload')}
      expect(error).to.throw('[vuex-keg] keg-plugin is undefined in Store')
    })
  })

  describe('keg with a wrong parameter', () => {
    it('should throw error', () => {
      const error = () => {
        // eslint-disable-next-line no-new
        new Vuex.Store({
          strict: true,
          state: {value: 1},
          actions: {...keg([actions.test, actions.testOnly])},
        })
      }
      expect(error).to.throw('[vuex-keg] only support object & function')
    })
  })

  describe('keg without plugins', () => {
    let result
    it('should run well 1', () => {
      const store = new Vuex.Store({
        strict: true,
        state: {value: 1},
        actions: {
          test: keg(() => {result = 'test'}),
        },
        plugins: [vuexKeg({})],
      })
      store.dispatch('test', 'payload')
      expect(result).to.equal('test')
    })
    it('should run well 2', () => {
      const store = new Vuex.Store({
        strict: true,
        state: {value: 1},
        actions: {
          test: keg(() => {result = 'test'}),
        },
        plugins: [vuexKeg()],
      })
      store.dispatch('test', 'payload')
      expect(result).to.equal('test')
    })
  })
})
