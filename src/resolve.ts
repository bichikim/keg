type TResolveOptionItem = string | boolean | ((name: string) => string)

export interface IResolveOptions {
  success?: TResolveOptionItem
  failure?: TResolveOptionItem
}

const kegResolve = (options: IResolveOptions | boolean) => () => {
  const {
    success = 'Success', failure = 'Failure',
  } = typeof options === 'boolean' ? {} : typeof options === 'undefined' ? {} : options
  return (context: any) => {
    return (resolve: Promise<any>, runOptions: boolean | IResolveOptions): Promise<any> => {
      if(!options && !runOptions){return}
      const {
        success: _success = success,
        failure: _failure = failure,
      } = typeof runOptions === 'boolean' ? {} : runOptions
      return new Promise((outResolve?: any, outReject?: any) => {
        resolve.then((result) => {
          context.commit(`${context.name}${_success}`, result)
          outResolve(result)
        }).catch((error) => {
          context.commit(`${context.name}${_failure}`, error)
          outReject(error)
        })
      })
    }
  }
}

export default kegResolve
