# polymatch

### Summary 

- `Accept: application/json+user` will trigger `user` filter
- `Accept: application/json+v1+user` will trigger both `v1` and `user` filters respectively.
- `.type(['v1', 'user'])` will trigger also.
- `.type('application/json+v1+user')` will trigger also.
- `filter1.use(filter2)` composition works; similar to express-router.
- `filter1.use({ key: [Function] })` json composition works.

### Examples

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
> Polymatch = require('polymatch')
[Function: Polymatch]
> f = new Polymatch
Polymatch { targets: [] }

> f.on('name/v1').use('full', (input) => { input.full = input.first + ' ' + input.last; return input })
Polymatch {
  targets: { 'name/v1': { full: [Function] } },
  selectedTarget: 'name/v1' }

> name = {first: 'Barack', last: 'Obama'}

> f.on('name/v1').input(name).type('application/json+not-existing-type').value()
{first: 'Barack', last: 'Obama'}

> f.on('name/version-3').input(name).type('application/json+full').value()
{first: 'Barack', last: 'Obama'}

> f.on('name/v1').input(name).type('application/json+full').value()
{first: 'Barack', last: 'Obama', full: 'Barack Obama'}


> f.on('name/v1').use({simple: (input) => { input.simple = input.first[0] + input.last[0]; return input }})

> f.on('name/v1').input(name).type('application/json+simple').value()
{ first: 'Barack',
  last: 'Obama',
  full: 'Barack Obama',
  simple: 'BO' }

> f.on('name/v1').input({first: 'Barack', last: 'Obama'}).type(['full']).value()
{first: 'Barack', last: 'Obama', full: 'Barack Obama'}
```

### Tests

`mocha test.js`

```
  filter
    ✓ payload with single mime-type string
    ✓ payload with multiple mime-type string
    ✓ composition with json
    ✓ payload with multiple mime-type array
    - payload with undefined filters
    - payload with multiple require filters


  4 passing (12ms)
  2 pending
```

### Changelog

- Version 1.1.0 **2017-11-22**: `from` to `input`, `to` to `type`
- Version 1.0.2 **2017-11-21**: Go to public with MIT license.

### Author

Jin Lee (currently working at @playauto)