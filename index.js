'use strict';

module.exports = zhi;

function zhi(src, options) {
  if (!isObject(src)) { return null; }

  options || (options = {});
  if (typeof options.tagStart !== 'string') { options.tagStart = '{{'; }
  if (typeof options.tagEnd !== 'string') { options.tagEnd = '}}'; }
  options.mixin || (options.mixin = {});

  const reg = options.reg = [
    options.tagStart.replace(/([\$\/\+\!\*])/g, '\\$1'),
    '\\s*([\\w.-]+)\\s*',
    options.tagEnd,
  ].join('');

  src = parse(src, reg);

  return run(src, options);
}

function parse(obj, reg) {
  const parsed = {};
  Object.keys(obj).forEach(function(key) {
    let i;
    const r = new RegExp(reg, 'g');
    const value = obj[key];
    const o = {
      name: key,
      deps: [],
      template: value,
    };

    while ((i = r.exec(value))) {
      if (obj[i[1]]) {
        o.deps.push(i[1]);
      }
    }
    parsed[key] = o;
  });
  return parsed;
}

function run(src, options) {
  const result = {};
  const re = new RegExp(options.reg, 'g');

  const mixin = options.mixin;
  const data = {};
  for (const j in src) {
    data[j] = src[j];
  }

  for (const i in src) {
    next(src[i]);
    result[i] = src[i].value;
  }

  return result;

  function next(a) {
    if (a.value) { return; }
    if (a._running) { throw new Error('Recursive dependency'); }

    a._running = true;
    a.deps.forEach(function(item) {
      // ignore self reference
      if (a.name === item) return;
      next(src[item]);
    });

    a.value = template(a);
    delete a._running;
  }

  function template(self) {
    const tpl = self.template;
    return typeof tpl !== 'string' ? tpl :
      tpl.replace(re, function(all, match) {
        if (data[match] && data[match].value) {
          return data[match].value;
        }
        if (mixin[match]) {
          return mixin[match];
        }
        return all;
      });
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
