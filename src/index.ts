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
const specialPlugins: string[] = []

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

const getKegFromStore = (store: IKegStore<any>):
{plugins: {[name: string]: TAgedPlugin}, options: IKegOptions} =>
{
  return {
    plugins: store[sKeg],
    options: store[sKegOptions],
  }
}

const setKegToStore = (store: IKegStore<any>, {plugins, options}: {
plugins: {[name: string]: TAgedPlugin},
options: IKegOptions,
}): void => {
  store[sKeg] = plugins
  store[sKegOptions] = options
}

const filterPlugins = (
  plugins: IOpenedPlugins,
  {except, only, shouldHave}: {except?: string[], only?: string[], shouldHave?: string[]},
): IOpenedPlugins => {
  let filteredPlugins = plugins
  if(except){filteredPlugins = omit(filteredPlugins, except)}
  if(only){filteredPlugins = pick(filteredPlugins, only)}
  if(shouldHave){
    for(let key of shouldHave){
      filteredPlugins[key] = plugins[key]
    }
  }
  for(let key of specialPlugins){
    filteredPlugins[key] = plugins[key]
  }
  return filteredPlugins
}
/**
 * Vuex keg plugin
 */
export default (options: IVuexKegOptions = {}): TKegReturn => {
  const {plugins = {}, beers = {}, resolve: _resolve} = options
  const myPlugins: IPlugins = {resolve: resolve(_resolve)}
  specialPlugins.push('resolve')
  Object.assign(myPlugins, plugins, beers)
  return (store: IKegStore<any>) => {
    setKegToStore(store, {
      plugins: _agePlugins(myPlugins, store),
      options: {resolve: _resolve},
    })
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
    const {plugins: kegPlugins, options: kegOptions} = getKegFromStore(this)
    if(!kegPlugins || !kegOptions){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
    const {
      only,
      except,
      shouldHave,
      resolve = kegOptions.resolve,
      payload: kegPayload,
      pluginOptions,
    } = options
    let filteredKegPlugins = filterPlugins(kegPlugins, {except, only, shouldHave})
    filteredKegPlugins.resolve = kegPlugins.resolve
    const _context = {...context, name}
    const plugins = _openPlugins(filteredKegPlugins, _context, payload, pluginOptions)
    const result = injectedAction({...plugins, ..._context}, payload, kegPayload)
    if(resolve){
      plugins.resolve(result, resolve)
    }
    return result
  }
}

export const keg = (
  injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
  options?: IKegOptions,
  name?: string,
): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> => {
  if(typeof injectedAction === 'function'){
    if(!name && process.env.NODE_ENV !== 'production'){
      console.warn(
        '[vuex-keg] name is undefined. the keg won\'t know what function name' +
        ' is in case of using function injectedAction',
      )
    }
    return kegRunner(name, injectedAction, options)
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
