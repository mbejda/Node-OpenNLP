# Extendy

Dead simple object extend.

## Install

```
npm i extendy --save
```

## How to use?

```js
var extendy = require('extendy'),
    obj     = {
        hello: 1
    }

extendy(obj, {
    world: 2
});

// result
{
    hello: 1,
    world: 2
}

```

## License

MIT
