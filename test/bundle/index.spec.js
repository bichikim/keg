const vuexKeg = require('../../dist/app')
const {expect} = require('chai')
describe('vuexKeg', () => {
  it('has members', () => {
    expect(vuexKeg.default).to.be.a('function')
    expect(vuexKeg.keg).to.be.a('function')
    expect(vuexKeg.Keg).to.be.a('function')
  })
})