import {forEach, omit, pick} from 'lodash'
import {ActionContext, Store} from 'vuex/types'
import Keg from './Keg'
import {
  ActionHandler,
  IAgedPlugins,
  IFnContext,
  IKegOptions,
  IKegStore,
  IOpenedPlugins,
  IPlugins,
  IVuexKegOptions,
  sKeg,
  sKegOptions,
  TAgedPlugin,
  THook,
  TInjectedFunction,
  TKegReturn,
  TPlugin,
} from './types'
export {Keg, sKeg, sKegOptions}

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
  const {plugins = {}, beers = {}, resultHooks} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: IKegStore<any>) => {
    store[sKeg] = _agePlugins(myPlugins, store)
    store[sKegOptions] = {resultHooks}
  }
}

const resultHookRunner = (
  context: IFnContext,
  hook: string | THook,
  result?: Promise<any>,
): any => {
  if(!result){return result}
  if(typeof hook === 'string'){
    const hookPlugin = context[hook]
    if(hookPlugin){
      return hookPlugin(result)
    }
    throw new Error(
      '[vuex-keg] hook string name should be a plugin name or ' +
      'the member name in action context',
    )
  }
  if(typeof hook === 'function'){
    return hook(context, result)
  }
  throw new Error('[vuex-keg] hook should be a function or string')
}

const resultHook = (
  context: IFnContext,
  hooks?: string | string[] | THook | THook[],
  result?: Promise<any>,
): any => {
  if(!hooks){return result}
  if(Array.isArray(hooks)){
    let _result = result
    forEach(hooks, (hook: string | THook) => {
      _result = resultHookRunner(context, hook, result)
    })
    return _result
  }
  return resultHookRunner(context, hooks, result)
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
    let kegOptions = this[sKegOptions]
    if(!kegPlugins || !kegOptions){
      throw new Error('[vuex-keg] keg-plugin | keg-options is undefined in Store')
    }
    const {only, except, resultHooks = kegOptions.resultHooks} = options
    if(except){
      kegPlugins = omit(kegPlugins, except)
    }
    if(only){
      kegPlugins = pick(kegPlugins, only)
    }
    const _context = {...context, name}
    const plugins = _openPlugins(kegPlugins, _context, payload)
    const actionContext = {...plugins, ..._context}
    return resultHook(actionContext, resultHooks, injectedAction(actionContext, payload))
  }
}

export const keg = (
  injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
  options?: IKegOptions,
): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> => {
  if(typeof injectedAction === 'function'){
    return kegRunner('unknown', injectedAction, options)
  }
  if(!Array.isArray(injectedAction) && typeof injectedAction === 'object'){
    const actions: {[name: string]: ActionHandler<any, any>} = {}
    Object.keys(injectedAction).forEach((pluginName) => {
      actions[pluginName] = kegRunner(pluginName, injectedAction[pluginName], options)
    })
    return actions
  }
  throw new Error('[vuex-keg] only support object & function')
}
