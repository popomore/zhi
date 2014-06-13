# Zhi

a key/value parser support simple template

[![Build Status](https://travis-ci.org/popomore/zhi.png?branch=master)](https://travis-ci.org/popomore/zhi)
[![Coverage Status](https://coveralls.io/repos/popomore/zhi/badge.png?branch=master)](https://coveralls.io/r/popomore/zhi?branch=master)


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

You can use extra data with `mixin` option

```
var options = {
  mixin: {
    'x': '1',
    'y': '2',
    'z': '3'
  }
};
zhi({
  a: '{{b}}/{{c}}',
  b: '{{x}}{{y}}{{z}}',
  c: '{{d}}',
  d: 'abc'
}, options);
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

## HISTORY

### 0.3.0

ignore self reference, and will not be parsed, example below

```
{
  a: '{{a}}'
}
```

### 0.2.2

support other type except for string

### 0.2.1

improve code

### 0.2.0

add mixin option

### 0.1.0

first version

## LISENCE

MIT
