import { ActionContext, Store } from 'vuex';
import { sKeg, sKegOptions } from './';
export declare type TOpenedPlugin = (...any: any[]) => any;
export declare type TPlugin = (store: Store<any>) => TAgedPlugin;
export declare type TAgedPlugin = (context: ActionContext<any, any>, payload: any, pluginOptions?: any) => TOpenedPlugin;
export declare type TInjectedFunction<T> = (context: T, payload: any, kegPayload?: any) => any;
export declare type TKegReturn = (store: IKegStore<any, any>) => void;
export declare type TFnHook<T> = (context: T, payload: any) => any;
export declare type ActionHandler<S, R> = (injectee: ActionContext<S, R>, payload: any) => any;
export interface IKegContext<S, R> extends ActionContext<S, R> {
    name: string;
}
export interface IPluginRunTimeOptions {
    [name: string]: any;
}
export interface IKegOptions<T> {
    only?: string[];
    except?: string[];
    shouldHave?: string[];
    beforeHook?: string | string[] | TFnHook<T> | Array<TFnHook<T>>;
    afterHook?: string | string[] | TFnHook<T> | Array<TFnHook<T>>;
    pluginOptions?: IPluginRunTimeOptions;
    payload?: any;
}
export interface IVuexKegOptions<T> extends IKegOptions<T> {
    plugins?: IPlugins;
    beers?: IPlugins;
}
export interface IPlugins {
    [name: string]: TPlugin;
}
export interface IAgedPlugins {
    [name: string]: TAgedPlugin;
}
export interface IOpenedPlugins {
    [name: string]: TOpenedPlugin;
}
export interface IKegStore<T, S> extends Store<S> {
    [sKeg]: IAgedPlugins;
    [sKegOptions]: IKegOptions<T>;
}
