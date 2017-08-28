import {expect} from 'chai'
import {describe, it} from 'mocha'
import keg from '../../src/vuex/index'
describe('Keg redux react plugin', () => {
  it('should return a function to handle next', () => {
    let executeDataFromKegPlugin
    const kegPlugin = (options) => (store) => (action, next) => (executeData) => {
      executeDataFromKegPlugin = executeData
    }
    const nextHandler = keg({
      plugins: {
        kegPlugin: kegPlugin({testText: 'OK'}),
      },
    })
    expect(nextHandler).to.be.a('function')
    // TODO
  })
})
