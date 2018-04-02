# Sulleong

![typescript][typescript]

[typescript]:https://img.shields.io/badge/typescript-2.7.*-blue.svg

> Key changer

## Install
```bash
yarn add sulleong
npm install --save sulleong
```

## How to use
```javascript

import sulleong, {PairMap} from './src/index'
let map = new PairMap({
  from1: 'to1',
  from2: 'to2',
  from3: 'to3',
})
let data = {
  from1: 'data',
  from2: 'data',
  from3: 'data',
}
const result = sulleong(data, map, false)
expect(result).to.deep.equal({
  to1: 'data',
  to2: 'data',
  to3: 'data',
})
const resultOpposite = sulleong(result, map, true)
expect(resultOpposite).to.deep.equal(data)

const map = new PairMap({
  from1: 'to1',
  fromDeep: {
    '@': 'toDeep',
    from2: 'to2',
    from3: 'to3',
    fromDeepDeep: {
      '@': 'toDeepDeep',
      from4: 'to4',
      from5: 'to5',
    },
  },
  from6: 'to6',
})
const data = {
  from1: 'data',
  fromDeep: {
    from2: 'data',
    from3: 'data',
    fromDeepDeep: {
      from4: 'data',
      from5: 'data',
    },
  },
  from6: 'data',
}
const result = sulleong(data, map, false)
expect(result).to.deep.equal({
  to1: 'data',
  toDeep: {
    to2: 'data',
    to3: 'data',
    toDeepDeep: {
      to4: 'data',
      to5: 'data',
    },
  },
  to6: 'data',
})
const resultOpposite = sulleong(result, map, true)
expect(resultOpposite).to.deep.equal(data)
```

### PairMap Options
```typescript
interface IPairMap{
  // set self identifier default = '@'
  selfFlag? :string
}
```



