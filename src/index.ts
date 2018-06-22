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
  IPlugins,
  IResolveOptions,
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
): IOpenedPlugins => {
  const openedPlugins: IOpenedPlugins = {}
  forEach(agedPlugins, (plugin: TAgedPlugin, key: string) => {
    openedPlugins[key] = plugin(context, payload)
  })
  return openedPlugins
}

/**
 * Vuex keg plugin
 */
export default (options: IVuexKegOptions = {}): TKegReturn => {
  const {
    plugins = {}, beers = {}, success, failure, mutation = false} = options
  const myPlugins: IPlugins = {resolve: resolve({success, failure})}
  Object.assign(myPlugins, plugins, beers)
  return (store: IKegStore<any>) => {
    store[sKeg] = _agePlugins(myPlugins, store)
    store[sKegOptions] = {mutation}
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
    const kegOptions: IResolveOptions = this[sKegOptions]
    if(!kegPlugins){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
    const {
      only, except,
      mutation = kegOptions.mutation,
      payload: kegPayload,
    } = options
    if(except){
      kegPlugins = omit(kegPlugins, except)
    }
    if(only){
      kegPlugins = pick(kegPlugins, only)
    }
    const _context = {...context, name}
    const plugins = _openPlugins(kegPlugins, _context, payload)
    const result = injectedAction({...plugins, ..._context}, payload, kegPayload)
    if(mutation){
      plugins.resolve(result)
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
