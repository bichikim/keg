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

  /**
   * use custom utils
   */
  tap(
    injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
    options: IKegOptions = {},
    name?: string,
  ): {[name: string]: ActionHandler<any, any>} | ActionHandler<any, any> {
    const {_options} = this
    const {
      only = _options.only,
      except = _options.except,
      shouldHave = _options.shouldHave,
      resolve = _options.resolve,
      payload = _options.payload,
      pluginOptions = _options.pluginOptions,
    } = options
    return keg(injectedAction, {
      only,
      except,
      shouldHave,
      resolve,
      payload,
      pluginOptions,
    }, name)
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
