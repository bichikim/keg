/**
 *
 * @author Bichi Kim [bichi@live.co.kr]
 * @copyright (c) Naree Co.
 * @license MIT
 * @module
 */
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
 * @param {object} agedPlugins
 * @param {object} mutation
 * @param {object} state
 * @return {{}}
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
 * @param {object} data
 * @param {object} data.plugins
 * @param {object|undefined} data.beers
 * @return {function(*=)}
 */
export default ({plugins = {}, beers}) => {
  if(plugins.next){
    throw new Error('Please do not use "next" for a keg plugin name.')
  }
  // Beers just another name of plugins. cheers!
  if(isObject(beers)){
    Object.assign(plugins, beers)
  }

  return (store) => {
    const agedPlugins = agePlugins(plugins, store)
    store.subscribe((mutation, state) => {
      const {payload} = mutation
      if(!isFunction(payload)){
        return
      }
      const openedPlugins = openPlugins(agedPlugins, mutation, state)
      const {type} = mutation
      payload({
        ...openedPlugins,
        next: (data) => (store.commit(type, data)),
      }, state)
    })
  }
}
