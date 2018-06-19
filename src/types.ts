import {ActionContext, Commit, Dispatch, Store} from 'vuex'

export type TOpenedPlugin = (...any: any[]) => any

export type TPlugin = (store: Store<any>) => TAgedPlugin

export type TAgedPlugin = (context: ActionContext<any, any>, payload: any) => TOpenedPlugin

export type TInjectedFunction = (context: IFnContext, payload?: any) => any

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
  [plugin: string]: TOpenedPlugin
}

export const sKeg = Symbol('keg')

export interface IVuexKegOptions {
  plugins?: IPlugins
  beers?: IPlugins // = plugins
}

export interface IKegOptions {
  only?: string[]
  except?: string[]
  // when?: () => Promise<any> next feather
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

export interface IKegStore<T> extends Store<T>{
  [sKeg]: IAgedPlugins
}
