import {forEach, omit, pick} from 'lodash'
import {ActionContext, Store} from 'vuex/types'
import Keg from './Keg'
import {
  ActionHandler,
  IAgedPlugins,
  IKegContext,
  IKegOptions,
  IKegStore,
  IOpenedPlugins,
  IPluginRunTimeOptions,
  IPlugins,
  IVuexKegOptions,
  TAgedPlugin,
  TFnHook,
  TInjectedFunction,
  TKegReturn,
  TPlugin,
} from './types'
export const sKeg = Symbol('keg')
export const sKegOptions = Symbol('kegOptions')
export * from './types'
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

function getKegFromStore<T, S>(store: IKegStore<T, S>):
  {plugins: {[name: string]: TAgedPlugin}, options: IKegOptions<T>}
{
  return {
    plugins: store[sKeg],
    options: store[sKegOptions],
  }
}

function setKegToStore<T, S>(store: IKegStore<T, S>, {plugins, options}: {
plugins: {[name: string]: TAgedPlugin},
options: IKegOptions<T>,
}): void {
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
  return filteredPlugins
}

function resolveHook<T extends IKegContext<S, R>, S, R>(
  context: T,
  plugins: IOpenedPlugins,
  payload: any,
  hook: string | TFnHook<T>,
) {
  if(typeof hook === 'string'){
    const plugin = plugins[hook]
    if(typeof plugin === 'function'){
      // eslint-disable-next-line no-await-in-loop
      return plugin(payload)
    }
    /* istanbul ignore next */
    if(process.env.NODE_ENV !== 'production'){
      console.warn(
        '[vuex-keg pipeRunner] hook name should be plugin name in the plugins')
    }
    return payload
  }else if(typeof hook === 'function'){
    // eslint-disable-next-line no-await-in-loop
    return hook(context, payload)
  }
  /* istanbul ignore next  */
  if(process.env.NODE_ENV !== 'production'){
    console.warn('[vuex-keg pipeRunner] hook should be function or string')
  }
  return payload
}

async function pipeRunner<T extends IKegContext<S, R>, S, R>(
  context: T,
  plugins: IOpenedPlugins,
  payload: any,
  hookList?: string | string[] | TFnHook<T> | Array<TFnHook<T>>,
) {
  if(!hookList){return payload}
  if(Array.isArray(hookList)){
    let result: any = payload
    for(const hook of hookList){
      // eslint-disable-next-line no-await-in-loop
      result = await resolveHook(context, plugins, result, hook)
    }
    return result
  }
  return resolveHook(context, plugins, payload, hookList)
}

/**
 * Vuex keg plugin
 */
export default function kegPlugin<T, S>(options: IVuexKegOptions<T> = {}): TKegReturn {
  const {plugins = {}, beers = {}, beforeHook, afterHook} = options
  return (store: IKegStore<T, S>) => {
    setKegToStore(store, {
      plugins: _agePlugins({...plugins, ...beers}, store),
      options: {beforeHook, afterHook},
    })
  }
}

/**
 * Vuex custom utils container function
 */
export function kegRunner<T extends IKegContext<S, R> , S, R>(
  name: string,
  injectedAction: TInjectedFunction<T>,
  options: IKegOptions<T> = {},
): ActionHandler<any, any> {
  return async function kegTap(context: T, payload) {
    const {plugins: kegPlugins, options: kegOptions} = getKegFromStore(this)
    if(!kegPlugins || !kegOptions){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
    const {
      only,
      except,
      shouldHave,
      payload: kegPayload,
      beforeHook = kegOptions.beforeHook,
      afterHook = kegOptions.afterHook,
      pluginOptions,
    } = options
    let filteredKegPlugins = filterPlugins(kegPlugins, {except, only, shouldHave})
    const _context: T = {...context as any,
      get name(): string {
        /* istanbul ignore if  */
        if(!name && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'){
          console.warn(
            '[vuex-keg] name is undefined. the keg won\'t know what function name' +
            ' is in case of using function injectedAction',
          )
        }
        return name
      },
    }
    const plugins: IOpenedPlugins = _openPlugins(
      filteredKegPlugins, _context, payload, pluginOptions,
    )
    const _payload = await pipeRunner(_context, plugins, payload, beforeHook)
    const result = await injectedAction({
      ...plugins,
      ..._context as any,
    }, _payload, kegPayload)
    return pipeRunner(_context, plugins, result, afterHook)
  }
}

/**
 * keg operator
 */
export function keg<T extends IKegContext<S, R>, S, R>(
  injectedAction: {[name: string]: TInjectedFunction<T>} | TInjectedFunction<T>,
  options?: IKegOptions<T>,
  name?: string,
): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> {
  if(typeof injectedAction === 'function'){
    return kegRunner<T, S, R>(name, injectedAction, options)
  }
  if(!Array.isArray(injectedAction) && typeof injectedAction === 'object'){
    const actions: {[name: string]: ActionHandler<any, any>} = {}
    Object.keys(injectedAction).forEach((key) => {
      actions[key] = kegRunner<T, S, R>(key, injectedAction[key], options)
    })
    return actions
  }
  throw new Error('[vuex-keg] only support object & function')
}
