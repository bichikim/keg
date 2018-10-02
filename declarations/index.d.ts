import Keg from './Keg';
import { ActionHandler, IKegContext, IKegOptions, IVuexKegOptions, TInjectedFunction, TKegReturn } from './types';
export declare const sKeg: unique symbol;
export declare const sKegOptions: unique symbol;
export * from './types';
export { Keg };
/**
 * Vuex keg plugin
 */
export default function kegPlugin<T, S>(options?: IVuexKegOptions<T>): TKegReturn;
/**
 * Vuex custom utils container function
 */
export declare function kegRunner<T extends IKegContext<S, R>, S, R>(name: string | undefined, injectedAction: TInjectedFunction<T>, options?: IKegOptions<T>): ActionHandler<any, any>;
/**
 * keg operator
 */
export declare function keg<T extends IKegContext<S, R>, S, R>(injectedAction: {
    [name: string]: TInjectedFunction<T>;
} | TInjectedFunction<T>, options?: IKegOptions<T>, name?: string): {
    [name: string]: ActionHandler<any, any>;
} | ActionHandler<any, any>;
