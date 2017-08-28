import 'babel-polyfill'
import forEach from 'lodash/forEach'

/**
 * Register store
 * @param {object} plugins
 * @param {object} store
 * @return {object}
 */
const agePlugins = (plugins, store) => {
  const agedPlugins = {}
  forEach(plugins, (plugin, key) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

/**
 * Register mutation and state
 * @param {object} plugins agedPlugins
 * @param {object} mutation
 * @param {object} state
 * @return {object}
 */
const openPlugins = (plugins, mutation, state) => {
  const openedPlugins = {}
  forEach(plugins, (plugin, key) => {
    openedPlugins[key] = plugin(mutation, state)
  })
  return openedPlugins
}

/**
 * Keg plugin
 * @param {object} plugins
 * @param {object|undefined} beers
 * @param {{isWork}}options
 * @return {function(*=)}
 */
export default ({plugins = {}, beers, options = {isWork: true}}) => {
  const {isWork} = options
  if (plugins.next){
    throw new Error('Please do not use "next" for a keg plugin name.')
  }
  // Beers just another name of plugins. cheers!
  if (typeof beers === 'object'){
    Object.assign(plugins, beers)
  }

  return (store) => {
    if (!isWork){
      return
    }
    const agedPlugins = agePlugins(plugins, store)
    store.subscribe((mutation, state) => {
      const {payload} = mutation
      const openedPlugins = openPlugins(agedPlugins, mutation, state)
      if (!(typeof payload === 'function')){
        return
      }
      const {type} = mutation
      payload({
        ...openedPlugins,
        next: (data) => (store.commit(type, data)),
      }, state)
    })
  }
}
