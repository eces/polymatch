# polymatch

- `Accept: application/json+user` will trigger `user` filter
- `Accept: application/json+v1+user` will trigger both `v1` and `user` filters respectively.
- `.type(['v1', 'user'])` will trigger also.
- `.type('application/json+v1+user')` will trigger also.
- `filter1.use(filter2)` composition works; similar to express-router.
- `filter1.use({ key: [Function] })` json composition works.

```js
const Polymatch = require('polymatch')
const filters = new Polymatch()

filters
    .on('v1/*')
    .use('user', (input) => {
        // transform for version
        input.uid = input.user_id
        return input
    })
    .use('company:1089', (input) => {
        // transform for specific customer
        input.name = `[${input.name}]`
        return input
    })
    .on('v1/result*')
    .use(require('./filter.result.js'))

// on router and handler
const result = this.filters
                .on('v1/result.xml')
                .input(rows)
                .type(req.get('accept') || ['json'])
                .value()
```

Try

```js
> a = require('./index.js')
[Function: Polymatch]
> b = new a
Polymatch { targets: [] }
> b.on('a').use('a', (input) => { return 'bbbb' })
Polymatch { targets: [ a: { a: [Function] } ], selectedTarget: 'a' }
> b.on('a').from(3).to('a').value()
3
> b.on('a').from(3).to('ab').value()
3
> b.on('a').from(3).to('absdf').value()
3
> b.on('adsf').from(3).to('absdf').value()
3
> b.on('a').from(3).to(['a']).value()
'bbbb'
> b.on('a').from(3).to('application/json+a').value()
'bbbb'
```

### Changelog

- Version 1.1.0 **2017-11-22**: `from` to `input`, `to` to `type`
- Version 1.0.2 **2017-11-21**: Go to public with MIT license.

### Author

Jin Lee (currently working at @playauto)