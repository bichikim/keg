type TResolveOptionItem = string | boolean | ((name: string) => string)
const defaultSuccessDecoration = 'Success'
const defaultFailureDecoration = 'Failure'

export interface IResolveOptions {
  success?: TResolveOptionItem
  failure?: TResolveOptionItem
}

const generateItem = (
  item: TResolveOptionItem,
  defaultItem: string,
): TResolveOptionItem => {
  if(item === true){return defaultItem}
  if(typeof item === 'undefined' || item === false){return}
  if(typeof item === 'function'){
    return item
  }
}

const generateOptions = (
  options: IResolveOptions | boolean,
): IResolveOptions | undefined => {
  if(typeof options === 'undefined' || options === false){return {}}
  if(options === true){return {
    success: defaultSuccessDecoration,
    failure: defaultFailureDecoration,
  }}
  if(typeof options === 'object'){
    const success = generateItem(options.success, defaultSuccessDecoration)
    const failure = generateItem(options.failure, defaultFailureDecoration)
    return {success, failure}
  }
}

const generateName = (operator: TResolveOptionItem, name: string) => {
  if(typeof operator === 'string'){
    return `${name}${operator}`
  }
  if(typeof operator === 'function'){
    return operator(name)
  }
}

const kegResolve = (options: IResolveOptions | boolean) => () => {
  const generatedOptions: IResolveOptions = generateOptions(options)
  return (context: any) => {
    return (resolve: Promise<any>, runOptions: boolean | IResolveOptions): Promise<any> => {
      if(!options && !runOptions){return}
      const {
        success,
        failure,
      } = {...generatedOptions, ...generateOptions(runOptions)}
      return new Promise((outResolve?: any, outReject?: any) => {
        resolve.then((result) => {
          if(success){
            context.commit(generateName(success, context.name), result)
          }
          outResolve(result)
        }).catch((error) => {
          if(failure){
            context.commit(generateName(failure, context.name), error)
          }
          outReject(error)
        })
      })
    }
  }
}

export default kegResolve
