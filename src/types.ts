import {ActionContext, Commit, Dispatch, Store} from 'vuex'
import {sKeg, sKegOptions} from './'

export type TOpenedPlugin = (...any: any[]) => any

export type TPlugin = (store: Store<any>) => TAgedPlugin

export type TAgedPlugin = (
  context: ActionContext<any, any>,
  payload: any,
  pluginOptions?: any,
) => TOpenedPlugin

export type TInjectedFunction = (
  context: IFnContext,
  payload: any,
  kegPayload?: any,
) => any

export type TKegReturn = (store: IKegStore<any>) => void

// since vuex not updated for this yet, I defined this
export type ActionHandler<S, R> = (injectee: ActionContext<S, R>, payload: any) => any

export interface IFnContext{
  dispatch: Dispatch
  commit: Commit
  state: any
  getters: any
  rootState: any
  rootGetters: any
  name: string
  [plugin: string]: TOpenedPlugin | any
}

export interface IPluginRunTimeOptions {
  [name: string]: any
}

export interface IKegOptions {
  only?: string[]
  except?: string[]
  shouldHave?: string[]
  beforeAction?: string | string[]
  afterAction?: string | string[]
  pluginOptions?: IPluginRunTimeOptions
  payload?: any
  // when?: () => Promise<any> next feather
}

export interface IVuexKegOptions extends IKegOptions{
  plugins?: IPlugins
  beers?: IPlugins // = plugins
  pluginOptions?: null // no item
}

export interface IPlugins {
  [name: string]: TPlugin
}

export interface IAgedPlugins {
  [name: string]: TAgedPlugin
}

export interface IOpenedPlugins {
  resolve?: TOpenedPlugin
  [name: string]: TOpenedPlugin
}

export interface IKegStore<T> extends Store<T>{
  [sKeg]: IAgedPlugins
  [sKegOptions]: IKegOptions
}
