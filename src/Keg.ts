import {keg} from './'
import {ActionHandler, IKegOptions, TInjectedFunction} from './types'

/**
 * Vuex custom utils container class
 */
export default class Keg {
  private _options: IKegOptions
  constructor(options: IKegOptions = {}) {
    this._options = options
  }

  // use custom utils
  //noinspection JSUnusedGlobalSymbols
  tap(
    injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
    options: IKegOptions = {},
  ): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> {
    const {_options} = this
    const {only = _options.only, except = _options.except} = options
    return keg(injectedAction, {only, except})
  }

  /**
   * change default options
   */
  set options(options: IKegOptions) {
    this._options = options
  }

  /**
   * get default options
   */
  get options(): IKegOptions {
    return {...this._options}
  }
}
