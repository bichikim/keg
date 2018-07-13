import {forEach, omit, pick} from 'lodash'
import {ActionContext, Store} from 'vuex/types'
import Keg from './Keg'
import resolve from './resolve'
import {
  ActionHandler,
  IAgedPlugins,
  IKegOptions,
  IKegStore,
  IOpenedPlugins,
  IPluginRunTimeOptions,
  IPlugins,
  IVuexKegOptions,
  TAgedPlugin,
  TInjectedFunction,
  TKegReturn,
  TPlugin,
} from './types'
export const sKeg = Symbol('keg')
export const sKegOptions = Symbol('kegOptions')
export {Keg}

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
  context: ActionContext<any, any>,
  payload: any,
  pluginOptions: IPluginRunTimeOptions = {},
): IOpenedPlugins => {
  const openedPlugins: IOpenedPlugins = {}
  forEach(agedPlugins, (plugin: TAgedPlugin, key: string) => {
    openedPlugins[key] = plugin(context, payload, pluginOptions[key])
  })
  return openedPlugins
}

/**
 * Vuex keg plugin
 */
export default (options: IVuexKegOptions = {}): TKegReturn => {
  const {plugins = {}, beers = {}, resolve: _resolve= {}} = options
  const myPlugins: IPlugins = {resolve: resolve(_resolve)}
  Object.assign(myPlugins, plugins, beers)
  return (store: IKegStore<any>) => {
    store[sKeg] = _agePlugins(myPlugins, store)
    store[sKegOptions] = {resolve: _resolve}
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
    let kegPlugins: {[name: string]: TAgedPlugin} = this[sKeg]
    const kegOptions: IKegOptions = this[sKegOptions]
    if(!kegPlugins){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
    const {
      only, except,
      resolve = kegOptions.resolve,
      payload: kegPayload,
      pluginOptions,
    } = options
    if(except){
      kegPlugins = omit(kegPlugins, except)
    }
    if(only){
      kegPlugins = pick(kegPlugins, only)
    }
    const _context = {...context, name}
    const plugins = _openPlugins(kegPlugins, _context, payload, pluginOptions)
    const result = injectedAction({...plugins, ..._context}, payload, kegPayload)
    if(resolve){
      plugins.resolve(resolve)
    }
    return result
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
