import 'babel-polyfill'
import forEach from 'lodash/forEach'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'

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
 * @param {object} agedPlugins agedPlugins
 * @param {object} mutation
 * @param {object} state
 * @return {object}
 */
const openPlugins = (agedPlugins, mutation, state) => {
  const openedPlugins = {}
  forEach(agedPlugins, (plugin, key) => {
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
export default ({plugins = {}, beers, options = {}}) => {
  const {isWork = true, name = 'KEG'} = options
  if (plugins.next){
    throw new Error('Please do not use "next" for a keg plugin name.')
  }
  // Beers just another name of plugins. cheers!
  if (isObject(beers)){
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
      if (!isFunction(payload)){
        return
      }
      const type = `${mutation.type}_${name}`
      payload({
        ...openedPlugins,
        next: (data) => (store.commit(type, data)),
      }, state)
    })
  }
}
