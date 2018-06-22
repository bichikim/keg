interface IOptions extends IRunningOptions{

}
interface IRunningOptions {
  success?: string
  failure?: string
  promise?: boolean
}

const kegResolve = (options: IOptions = {}) => () => {
  const {success = 'Success', failure = 'Failure'} = options
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
