import {ActionContext, Store} from 'vuex'
import {sKeg, sKegOptions} from './'

// T = ActionContext with Plugins
// S = Store local State
// R = Root State

export type TOpenedPlugin = (...any: any[]) => any

export type TPlugin = (store: Store<any>) => TAgedPlugin

export type TAgedPlugin = (
  context: ActionContext<any, any>,
  payload: any,
  pluginOptions?: any,
) => TOpenedPlugin

export type TInjectedFunction<T> = (
  context: T,
  payload: any,
  kegPayload?: any,
) => any

export type TKegReturn = (store: IKegStore<any, any>) => void

export type TFnHook<T> = (context: T, payload: any) => any

// since vuex not updated for this yet, I defined this
export type ActionHandler<S, R> = (injectee: ActionContext<S, R>, payload: any) => any

export interface IKegContext<S, R> extends ActionContext<S, R>{
  name: string
}

export interface IPluginRunTimeOptions {
  [name: string]: any
}

export interface IKegOptions<T> {
  only?: string[]
  except?: string[]
  shouldHave?: string[]
  beforeHook?: string | string[] | TFnHook<T> | Array<TFnHook<T>>
  afterHook?: string | string[] | TFnHook<T> |  Array<TFnHook<T>>
  pluginOptions?: IPluginRunTimeOptions
  payload?: any
}

export interface IVuexKegOptions<T> extends IKegOptions<T>{
  plugins?: IPlugins
  beers?: IPlugins // = plugins
}

export interface IPlugins {
  [name: string]: TPlugin
}

export interface IAgedPlugins {
  [name: string]: TAgedPlugin
}

export interface IOpenedPlugins {
  [name: string]: TOpenedPlugin
}

export interface IKegStore<T, S> extends Store<S>{
  [sKeg]: IAgedPlugins
  [sKegOptions]: IKegOptions<T>
}
