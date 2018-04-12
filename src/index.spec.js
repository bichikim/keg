/* eslint-disable max-nested-callbacks */
import vuexKeg, {keg, Keg, sKeg} from './index'
import Vuex from 'vuex'
import Vue from 'vue'

describe('Keg', () => {
  Vue.use(Vuex)
  let receive
  let receiveContext
  let store

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
          test: keg((context) => {
            receiveContext = context
            const {test} = context
            test('prams')
          }),
          testOnly: keg((context) => {
            receiveContext = context
            const {forOnly} = context
            forOnly('prams')
          }, {
            only: ['forOnly'],
          }),
          testExcept: keg((context) => {
            receiveContext = context
            const {test} = context
            test('prams')
          }, {
            except: ['forExcept'],
          }),
          testExceptAndOnly: keg((context) => {
            receiveContext = context
            const {forOnly} = context
            forOnly('prams')
          }, {
            only: ['forOnly'],
            except: ['forExcept'],
          }),
        },
        plugins: [
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
          })],
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
    it('can run a keg plugin', () => {
      store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')

    })
    it('can run a keg plugin: only', () => {
      store.dispatch('testOnly', 'payload')
      expect(receive.payload).to.equal('payload')
      expect(receive.prams).to.equal('prams')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('can run a keg plugin: expect', () => {
      store.dispatch('testExcept', 'payload')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
    it('can run a keg plugin: expect & only', () => {
      store.dispatch('testExceptAndOnly', 'payload')
      expect(receiveContext.forOnly).to.be.a('function')
      expect(receiveContext.test).to.be.a('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
    })
  })

  describe('Keg class', () => {
    let keg
    const makeStore = (keg) => {

      store = new Vuex.Store({
        strict: true,
        state: {
          value: 1,
        },
        actions: {
          test: keg.tap((context) => {
            receiveContext = context
            const {test} = context
            test('prams')
          }),
          testOnly: keg.tap((context) => {
            receiveContext = context
            const {forOnly} = context
            forOnly('prams')
          }),
          testExcept: keg.tap((context) => {
            receiveContext = context
            const {test} = context
            test('prams')
          }),
          testExceptAndOnly: keg.tap((context) => {
            receiveContext = context
            const {forOnly} = context
            forOnly('prams')
          }, {
            only: ['forOnly'],
            except: ['forExcept'],
          }),
        },
        plugins: [
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
          })],
      })
    }
    beforeEach(() => {
      receive = null
      receiveContext = null
      store = null
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
    it('can create an instance without arguments', () => {
      keg = new Keg()
      makeStore(keg)
      store.dispatch('test', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.a('function')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can create an instance : only', () => {
      keg = new Keg({
        only: ['forOnly'],
      })
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can create an instance : except', () => {
      keg = new Keg({
        except: ['forExcept'],
      })
      makeStore(keg)
      store.dispatch('testExcept', 'payload')
      expect(receiveContext.test).to.be.a('function')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can create an instance : only & except', () => {
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
    it('can change default options', () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
      })
      makeStore(keg)
      // change options
      keg.options = {
        only: ['forOnly'],
      }
      store.dispatch('testOnly', 'payload')
      expect(receiveContext.test).to.be.an('undefined')
      expect(receiveContext.forExcept).to.be.an('undefined')
      expect(receiveContext.forOnly).to.be.a('function')
    })
    it('can get options', () => {
      keg = new Keg({
        only: ['forOnly'],
        except: ['forExcept'],
      })
      makeStore(keg)
      store.dispatch('testOnly', 'payload')
      expect(keg.options).to.deep.equal({
        only: ['forOnly'],
        except: ['forExcept'],
      })
    })
  })

})
