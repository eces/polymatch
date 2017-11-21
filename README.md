# polymatch

- `Accept: application/json+user` will trigger `user` filter
- `Accept: application/json+v1+user` will trigger both `v1` and `user` filters respectively.
- `.to(['v1', 'user'])` will trigger also.
- `.to('application/json+v1+user')` will trigger also.

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
                .from(rows)
                .to(req.get('accept') || ['json'])
                .value()
```
