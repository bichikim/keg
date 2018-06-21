import {forEach, omit, pick} from 'lodash'
import {ActionContext, Store} from 'vuex/types'
import Keg from './Keg'
import {
  ActionHandler,
  IAgedPlugins,
  IKegOptions,
  IKegStore,
  IOpenedPlugins,
  IPlugins,
  IVuexKegOptions,
  sKeg,
  TAgedPlugin,
  TInjectedFunction,
  TKegReturn,
  TPlugin,
} from './types'
export {Keg, sKeg}

/**
 * call plugins with store
 */
const _agePlugins = (plugins: IPlugins, store: Store<any>): IAgedPlugins => {
  const agedPlugins: IAgedPlugins = {}
  forEach(plugins, (plugin: TPlugin, key: string) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

/**
 * call aged plugins with context and payload of an action
 */
const _openPlugins = (
  agedPlugins: IAgedPlugins,
  name: string,
  context: ActionContext<any, any>,
  payload: any,
): IOpenedPlugins => {
  const openedPlugins: IOpenedPlugins = {}
  forEach(agedPlugins, (plugin: TAgedPlugin, key: string) => {
    openedPlugins[key] = plugin(name, context, payload)
  })
  return openedPlugins
}

/**
 * Vuex keg plugin
 */
export default (options: IVuexKegOptions = {}): TKegReturn => {
  const {plugins = {}, beers = {}} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: IKegStore<any>) => {
    store[sKeg] = _agePlugins(myPlugins, store)
  }
}

/**
 * Vuex custom utils container function
 */
export const kegRunner = (
  name: string,
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
    const plugins = _openPlugins(myPlugins, name, context, payload)
    return injectedAction({...plugins, ...context}, payload)
  }
}

export const keg = (
  injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
  options?: IKegOptions,
): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> => {
  if(typeof injectedAction === 'function'){
    console.error('deprecated using like that')
    return kegRunner('unknown', injectedAction, options)
  }
  if(!Array.isArray(injectedAction) && typeof injectedAction === 'object'){
    const actions: {[name: string]: ActionHandler<any, any>} = {}
    Object.keys(injectedAction).forEach((key) => {
      actions[key] = kegRunner(key, injectedAction[key], options)
    })
    return actions
  }
  throw new Error('[vuex-keg] only support object & function')
}
