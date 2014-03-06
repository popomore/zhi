# Zhi

a key/value parser support simple template

---

## Install

```
$ npm install zhi -g
```

## Usage

You can use zhi resolve parameter of dependency.

```
var zhi = require('zhi');
zhi({
  a: '{{b}}/{{c}}',
  b: '123',
  c: '{{d}}',
  d: 'abc'
})
```

return

```
{
  a: '123/abc',
  b: '123',
  c: 'abc',
  d: 'abc'
}
```

You can change tagName with `tagStart` and `tagEnd`.

```
zhi(obj, {
  tagStart: '<%',
  tagEnd: '%>'
});
```

## LISENCE

MIT
