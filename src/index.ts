import {ActionContext, Store} from 'vuex/types'
import {forEach, omit, pick} from 'lodash'
import Keg from './Keg'
import {
  IKegOptions, IPlugins, IVuexKegOptions, TAgedPlugin, TInjectedFunction,
  IAgedPlugins, ActionHandler
} from './types'
export {Keg}
export const sKeg = Symbol('keg')

const _agePlugins = (plugins: IPlugins, store: Store<any>): {} => {
  const agedPlugins: IAgedPlugins = {}
  forEach(plugins, (plugin, key) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

const _openPlugins = (agedPlugins: {}, context: ActionContext<any, any>, payload: any) => {
  const openedPlugins: IPlugins = {}
  forEach(agedPlugins, (plugin, key) => {
    openedPlugins[key] = plugin(context, payload)
  })
  return openedPlugins
}

export default (options: IVuexKegOptions = {}) => {
  const {plugins = {}, beers = {}} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: any = {}) => {
    const {state} = store
    if(!state){
      throw new Error('[vuex-keg] rootStore has no state')
    }
    store.state[sKeg] = _agePlugins(myPlugins, store)
  }
}

export const keg = (
  injectedAction: TInjectedFunction,
  options: IKegOptions = {},
): ActionHandler<any, any> => {
  return (context, payload) => {
    const {rootState} = context
    let myPlugins: {[name: string]: TAgedPlugin} = rootState[sKeg]
    const {only, except} = options
    if(except){
      myPlugins = omit(myPlugins, except)
    }
    if(only){
      myPlugins = pick(myPlugins, only)
    }
    const plugins = _openPlugins(myPlugins, context, payload)
    return injectedAction({...plugins, ...context}, payload)
  }
}

