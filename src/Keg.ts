import {keg} from './'
import {ActionHandler, IKegContext, IKegOptions, TInjectedFunction} from './types'

/**
 * Vuex custom utils container class
 */
export default class Keg<T extends IKegContext<S, R>, S, R> {
  private _options: IKegOptions<T>
  constructor(options: IKegOptions<T> = {}) {
    this._options = options
  }

  /**
   * use custom utils
   */
  tap(
    injectedAction: {[name: string]: TInjectedFunction<T>} | TInjectedFunction<T>,
    options: IKegOptions<T> = {},
    name?: string,
  ): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> {
    const {_options} = this
    return keg(injectedAction, Object.assign({}, _options, options), name)
  }

  /**
   * change default options
   */
  set options(options: IKegOptions<T>) {
    this._options = options
  }

  /**
   * get default options
   */
  get options(): IKegOptions<T> {
    return {...this._options}
  }
}
