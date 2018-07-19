/* eslint-disable max-nested-callbacks,max-lines */
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
  let receiveAfterPlugin
  let receiveBeforePlugin
  let store
  const plugins = [
    vuexKeg({
      plugins: {
        test: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {store, context, payload, prams}
            }
          }
        },
        forExcept: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {store, context, payload, prams}
            }
          }
        },
        forRunTimePluginOptions: (store) => {
          return (context, payload, runtimeOptions) => {
            return (prams) => {
              receive = {store, context, payload, prams, runtimeOptions}
            }
          }
        },
        forBeforePlugin: (store) => {
          return (context, payload, runtimeOptions) => {
            return (prams) => {
              receive = {store, context, payload, prams, runtimeOptions}
              receiveBeforePlugin = prams
              return `before/${prams}`
            }
          }
        },
        forAfterPlugin: (store) => {
          return (context, payload, runtimeOptions) => {
            return (prams) => {
              receive = {store, context, payload, prams: 'prams', runtimeOptions}
              receiveAfterPlugin = prams
              return `after/${prams}`
            }
          }
        },
      },
      beers: {
        forOnly: (store) => {
          return (context, payload) => {
            return (prams) => {
              receive = {store, context, payload, prams}
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
    testPluginOptions: (context) => {
      receiveContext = context
      const {forRunTimePluginOptions} = context
      forRunTimePluginOptions('prams')
    },
    testBefore: (context, payload) => {
      receiveContext = context
      return payload.split('/')[1]
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
    it('should run a keg plugin', async () => {
      await store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should run a keg plugin: only', async () => {
      await store.dispatch('testOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect', async () => {
      await store.dispatch('testExcept', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect & only', async () => {
      await store.dispatch('testExceptAndOnly', 'payload')
      expect(receiveContext.test).to.be.a('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('should run a keg plugin: expect & only & shouldHave', async () => {
      await store.dispatch('testExceptOnlyAndShouldHave', 'payload')
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
        state: {value: 1},
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
    it('should return object to map 1', async () => {
      await store.dispatch('testOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
    })
    it('should return object to map 2', async () => {
      await store.dispatch('testExcept', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
    })
    it('should return object to map 3', async () => {
      await store.dispatch('testExceptAndOnly', 'payload')
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
          testPluginOptions: keg.tap(actions.testPluginOptions, {}),
          testBefore: keg.tap(actions.testBefore),
        },
        plugins,
      })
    }
    beforeEach(() => {
      receive = null
      receiveContext = null
      store = null
      receiveBeforePlugin = null
      receiveAfterPlugin = null
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
    it('should create an instance without arguments', async () => {
      keg = new Keg()
      makeStore(keg)
      await store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only', async () => {
      keg = new Keg({only: ['forOnly']})
      makeStore(keg)
      await store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : except', async () => {
      keg = new Keg({except: ['forExcept']})
      makeStore(keg)
      await store.dispatch('testExcept', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only & except', async () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
      })
      makeStore(keg)
      await store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.a('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : only & except & shouldHave', async () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
        shouldHave: ['test'],
      })
      makeStore(keg)
      await store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('should create an instance : pluginOptions boolean type', async () => {
      keg = new Keg({
        pluginOptions: {
          forRunTimePluginOptions: 'option',
        },
      })
      makeStore(keg)
      await store.dispatch('testPluginOptions', 'payload')
      expect(receiveContext.forRunTimePluginOptions).to.be.a('function')
      expect(receive.runtimeOptions).to.equal('option')
    })
    it('should create an instance : beforeAction list & afterAction list', async () => {
      keg = new Keg({
        beforeAction: ['forBeforePlugin'],
        afterAction: ['forAfterPlugin'],
      })
      makeStore(keg)
      const result = await store.dispatch('testBefore', 'payload')
      expect(receiveBeforePlugin).to.equal('payload')
      expect(receiveAfterPlugin).to.equal('payload')
      expect(result).to.equal('after/payload')
    })
    it('should create an instance : beforeAction list & afterAction list', async () => {
      keg = new Keg({
        beforeAction: ['forBeforePlugin'],
        afterAction: ['forAfterPlugin'],
      })
      makeStore(keg)
      const result = await store.dispatch('testBefore', 'payload')
      expect(receiveBeforePlugin).to.equal('payload')
      expect(receiveAfterPlugin).to.equal('payload')
      expect(result).to.equal('after/payload')
    })
    it('should create an instance : beforeAction list & afterAction', async () => {
      keg = new Keg({
        beforeAction: 'forBeforePlugin',
        afterAction: 'forAfterPlugin',
      })
      makeStore(keg)
      const result = await store.dispatch('testBefore', 'payload')
      expect(receiveBeforePlugin).to.equal('payload')
      expect(receiveAfterPlugin).to.equal('payload')
      expect(result).to.equal('after/payload')
    })
    it('can change default options', async () => {
      keg = new Keg({only: ['forOnly'], except: ['forExcept']})
      makeStore(keg)
      // change options
      keg.options = {only: ['forOnly']}
      await store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can get options', async () => {
      keg = new Keg({only: ['forOnly'], except: ['forExcept']})
      makeStore(keg)
      await store.dispatch('testOnly', 'payload')
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
      store.dispatch('test', 'payload').then(() => {
        throw Error('no Error')
      }).catch((e) => {
        expect(e).to.throw('[vuex-keg] keg-plugin is undefined in Store')
      })
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
    it('should run well 1', async () => {
      const store = new Vuex.Store({
        strict: true,
        state: {value: 1},
        actions: {
          test: keg(() => {result = 'test'}),
        },
        plugins: [vuexKeg({})],
      })
      await store.dispatch('test', 'payload')
      expect(result).to.equal('test')
    })
    it('should run well 2', async () => {
      const store = new Vuex.Store({
        strict: true,
        state: {value: 1},
        actions: {
          test: keg(() => {result = 'test'}),
        },
        plugins: [vuexKeg()],
      })
      await store.dispatch('test', 'payload')
      expect(result).to.equal('test')
    })
  })
})
