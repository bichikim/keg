import { ActionHandler, IKegContext, IKegOptions, TInjectedFunction } from './types';
/**
 * Vuex custom utils container class
 */
export default class Keg<T extends IKegContext<S, R>, S, R> {
    private _options;
    constructor(options?: IKegOptions<T>);
    /**
     * use custom utils
     */
    tap(injectedAction: {
        [name: string]: TInjectedFunction<T>;
    } | TInjectedFunction<T>, options?: IKegOptions<T>, name?: string): {
        [name: string]: ActionHandler<any, any>;
    } | ActionHandler<any, any>;
    /**
     * change default options
     */
    /**
    * get default options
    */
    options: IKegOptions<T>;
}
