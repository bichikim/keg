import {ActionContext, Commit, Dispatch, Store} from 'vuex'
import {sKeg, sKegOptions} from './'

export type TOpenedPlugin = (...any: any[]) => any

export type TPlugin = (store: Store<any>) => TAgedPlugin

export type TAgedPlugin = (
  context: ActionContext<any, any>,
  payload: any,
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

export interface IVuexKegOptions extends IResolveOptions{
  plugins?: IPlugins
  beers?: IPlugins // = plugins
  // action?: boolean next feather
}

export interface IResolveOptions {
  success?: string
  failure?: string
  mutation?: boolean
}

export interface IKegOptions {
  only?: string[]
  except?: string[]
  mutation?: boolean
  payload?: any
  // action?: boolean next feather
  // when?: () => Promise<any> next feather
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
  [sKegOptions]: IResolveOptions
}
