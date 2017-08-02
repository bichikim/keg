import {expect} from 'chai'
import {describe, it} from 'mocha'
import keg from '../index'
describe('Keg', () => {
    it('is function', () => {
        expect(keg).to.be.a('function')
    })
})
