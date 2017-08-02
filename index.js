export const vuex= ({plugins = {}, beers, options = {isWork: true}}) => {
    const {isWork} = options
    if (plugins.next) {
        throw new Error('Please do not use a name "next" for a keg plugin.')
    }
    // Beers just another name of plugins. cheers!
    if (typeof beers === 'object') {
        Object.assign(plugins, beers)
    }
    return (store) => {
        if (!isWork) {
            return
        }
        store.subscribe((mutation, state) => {
            const {payload} = mutation
            if (!(typeof payload === 'function')) {
            return
        }
        const {type} = mutation
        payload({
                ...plugins,
            next: (data) => (store.commit(type, data)),
    }, state)
    })
    }
}
