import {ActionContext, Store} from 'vuex/types'
import {forEach, omit, pick} from 'lodash'
import Keg from './Keg'
import {
  IKegOptions,
  IPlugins,
  IVuexKegOptions,
  TAgedPlugin,
  TInjectedFunction,
  IAgedPlugins,
  ActionHandler,
} from './types'
export {Keg}
export const sKeg = Symbol('keg')

/**
 * call plugins with store
 */
const _agePlugins = (plugins: IPlugins, store: Store<any>): {} => {
  const agedPlugins: IAgedPlugins = {}
  forEach(plugins, (plugin, key) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

/**
 * call aged plugins with context and payload of an action
 */
const _openPlugins = (agedPlugins: {}, context: ActionContext<any, any>, payload: any) => {
  const openedPlugins: IPlugins = {}
  forEach(agedPlugins, (plugin, key) => {
    openedPlugins[key] = plugin(context, payload)
  })
  return openedPlugins
}

/**
 * Vuex keg plugin
 */
export default (options: IVuexKegOptions = {}) => {
  const {plugins = {}, beers = {}} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: any) => {
    store[sKeg] = _agePlugins(myPlugins, store)
  }
}

/**
 * Vuex custom utils container function
 */
export const keg = (
  injectedAction: TInjectedFunction,
  options: IKegOptions = {},
): ActionHandler<any, any> => {
  return function kegTap(context, payload) {
    let myPlugins: {[name: string]: TAgedPlugin} = this[sKeg]
    if(!myPlugins){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
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
