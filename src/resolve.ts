type TResolveOptionItem = string | boolean | ((name: string) => string)

export interface IResolveOptions {
  success?: TResolveOptionItem
  failure?: TResolveOptionItem
}

const kegResolve = (options: IResolveOptions | boolean = {}) => () => {
  const {success = 'Success', failure = 'Failure'} = typeof options === 'boolean' ? {} : options
  return (context: any) => {
    return (resolve: Promise<any>, runOptions: IRunningOptions = {}): Promise<any> => {
      const run = (outResolve?: any, outReject?: any) => {
        resolve.then((result) => {
          context.commit(`${context.name}${success}`, result)
          if(outResolve){
            outResolve(result)
          }
        }).catch((error) => {
          context.commit(`${context.name}${failure}`, error)
          if(outReject){
            outReject(error)
          }
        })
      }
      if(runOptions.promise || options.promise){
        return new Promise(run)
      }
      run()
    }
  }
}

export default kegResolve
