import {ActionHandler, Store} from '@@/types/vuex'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import {IKegOptions, IPlugins, IVuexKegOptions, TAgedPlugin, TInjectedFunction} from './types'

const sKeg = Symbol('keg')

const _agePlugins = (plugins: IPlugins, store: Store<any>): {} => {
  const agedPlugins = {}
  forEach(plugins, (plugin, key) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

const _openPlugins = (agedPlugins: {}, context, payload) => {
  const openedPlugins = {}
  forEach(agedPlugins, (plugin, key) => {
    openedPlugins[key] = plugin(context, payload)
  })
  return openedPlugins
}

export default (options: IVuexKegOptions = {}) => {
  const {plugins = {}, beers = {}} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: Store<any>) => {
    const agedPlugins = _agePlugins(myPlugins, store)
    store.subscribeAction((action, state) => {
      action.payload = {type: action.type, payload: action.payload}
      if(!state[sKeg]){
        state[sKeg] = agedPlugins
      }
    })
  }
}

export const keg = (
  injectedAction: TInjectedFunction,
  options: IKegOptions = {},
): ActionHandler<any, any> => {
  return (context, payload) => {
    const {state} = context
    let myPlugins: {[name: string]: TAgedPlugin} = state[sKeg]
    const {only, except} = options
    if(except){
      myPlugins = omit(myPlugins, except)
    }
    if(only){
      myPlugins = pick(myPlugins, only)
    }
    const plugins = _openPlugins(myPlugins, context, payload)
    return injectedAction({...plugins, ...context}, payload)
  }
}

export class Keg {
  private _options: IKegOptions
  constructor(options: IKegOptions = {}) {
    this._options = options
  }

  tap(
    injectedAction: TInjectedFunction,
    options: IKegOptions = {},
  ): ActionHandler<any, any> {
    const {_options} = this
    const {only = _options.only, except = _options.except} = options
    return keg(injectedAction, {only, except})
  }

  set options(options: IKegOptions) {
    this._options = options
  }

  get options() {
    return clone(this._options)
  }
}
