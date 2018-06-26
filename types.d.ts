import {ActionContext, Store} from 'vuex/types'
import {Keg, keg, kegRunner, sKeg, sKegOptions} from './src'
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
  sKegOptions,
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

// noinspection JSUnusedGlobalSymbols
export default kegPlugin
