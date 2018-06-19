import {ActionContext, Store} from 'vuex/types'
import {Keg, keg, kegRunner, sKeg} from './src'
import kegPlugin from './src'
import {
  ActionHandler,
  IAgedPlugins,
  IKegOptions,
  IPlugins,
  IVuexKegOptions,
  TAgedPlugin,
  TInjectedFunction,
} from './src/types'
export {
  Keg,
  sKeg,
  keg,
  kegRunner,
  ActionContext,
  Store,
  IKegOptions,
  IPlugins,
  IVuexKegOptions,
  TAgedPlugin,
  TInjectedFunction,
  IAgedPlugins,
  ActionHandler,
}

export default kegPlugin
