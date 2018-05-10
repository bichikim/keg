import {ActionHandler, IKegOptions, TInjectedFunction} from './types'
import {clone} from 'lodash'
import {keg} from './'

/**
 * Vuex custom utils container class
 */
export default class Keg {
  private _options: IKegOptions
  constructor(options: IKegOptions = {}) {
    this._options = options
  }

  /**
   * use custom utils
   */
  tap(
    injectedAction: TInjectedFunction,
    options: IKegOptions = {},
  ): ActionHandler<any, any> {
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
  get options() {
    return clone(this._options)
  }
}
