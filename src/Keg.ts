import {ActionHandler, IKegOptions, TInjectedFunction} from './types'
import {keg} from './'

export default class Keg {
  private _options: IKegOptions
  constructor(options: IKegOptions = {}) {
    this._options = options
  }

  tap(
    injectedAction: TInjectedFunction,
    options: IKegOptions = {},
  ): ActionHandler<any, any> {
    const {_options} = this
    const {only = _options.only, except = _options.except} = options
    return keg(injectedAction, {only, except})
  }

  set options(options: IKegOptions) {
    this._options = options
  }

  get options() {
    return {...this._options}
  }
}
