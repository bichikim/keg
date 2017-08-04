import {expect} from 'chai'
import {describe, it} from 'mocha'
import keg from '../../src/vuex/index'
describe('Keg', () => {
    it('is a function', () => {
        expect(keg).to.be.a('function')
    })
    {
        let isErrorForbid = false
        try {
            keg({plugins: {next: (data) => (data)}})
        } catch (error) {
            isErrorForbid = true
        }

        it('cannot allow name of next plugin', () => {
            expect(isErrorForbid).to.equal(true)
        })
    }
    {
        let isErrorAllow = false
        let kegForTest
        let TestPluginResult
        try {
            kegForTest = keg({plugins: {TestPlugin: (data) => (TestPluginResult = data)}})
        } catch (error) {
            isErrorAllow = true
        }

        it('can allow other name of plugin', () => {
            expect(isErrorAllow).to.equal(false)
        })

        it('return a function', () => {
            expect(kegForTest).to.be.a('function')
        })

        let result
        let stateCommitType
        let stateCommitData

        const store = {
            subscribe(func) {
                result = func
            },
            commit: (type, data) => {
                stateCommitType = type
                stateCommitData = data
            },
        }

        describe('the function', () => {
            it('use store.subscribe with result function', () => {
                kegForTest(store)
                expect(result).to.be.a('function')
            })
        })

        let mutationResultPayload
        let mutationResultState

        const mutation = {
            payload: (payload, state) => {
                mutationResultPayload = payload
                mutationResultState = state
            },
            type: 'Hi i am a type',
        }
        const state = {
            item: 'this is a state item',
        }

        describe('the result function', () => {
            it('use payload in parameter of mutation', () => {
                result(mutation, state)
                expect(mutationResultPayload).to.be.a('object')
                expect(mutationResultPayload.next).to.be.a('function')
                expect(mutationResultState).to.be.a('object')
                expect(mutationResultState.item).to.equal('this is a state item')
            })
        })

        describe('the next plugin', () => {
            it('use a commit function in state', () => {
                mutationResultPayload.next('this is a data')
                expect(stateCommitType).to.equal('Hi i am a type')
                expect(stateCommitData).to.equal('this is a data')
            })
        })
    }
})
