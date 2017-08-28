import isFunction from 'lodash/isFunction'
import forEach from 'lodash/forEach'
const agePlugins = (plugins, store) => {
  const agedPlugins = {}
  forEach(plugins, (plugin, key) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}
const openPlugins = (agedPlugins, action, next) => {
  const openedPlugins = {}
  forEach(agedPlugins, (plugin, key) => {
    openedPlugins[key] = plugin(action, next)
  })
  return openedPlugins
}
const keg = (options) => {
  const {isUsingPayload = true, plugins = {}} = options
  let getPayload
  if (isUsingPayload){
    getPayload = (action) => (action.payload)
  } else {
    getPayload = (action) => (action)
  }
  return (store) => {
    const agedPlugins = agePlugins(plugins, store)
    return (next) => (action) => {
      const payload = getPayload(action)
      if (!isFunction(payload)){
        return
      }
      const openedPlugins = openPlugins(agedPlugins, action, next)
      let nextInPayload
      if (isUsingPayload){
        nextInPayload = (payload) => (next({payload, type}))
      } else {
        nextInPayload = (payload) => (next({...payload, type}))
      }
      const {type} = action
      payload({
        ...openedPlugins,
        next: nextInPayload,
      }, store.getState)
    }
  }
}
export default keg
