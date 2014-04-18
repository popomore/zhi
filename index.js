module.exports = zhi;

function zhi (src, options) {
  if (!isObject(src)) {return null;}

  options || (options = {});
  if (typeof options.tagStart !== 'string') {options.tagStart = '{{';}
  if (typeof options.tagEnd !== 'string') {options.tagEnd = '}}';}
  options.mixin || (options.mixin = {});

  var reg = options.reg = [
    options.tagStart.replace(/([\$\/\+\!\*])/g, '\\$1'),
    '\\s*([\\w.-]+)\\s*',
    options.tagEnd
  ].join('');

  src = parse(src, reg);
  options.mixin = parseMixin(options.mixin);

  return run(src, options);
}

function parse (obj, reg) {
  var parsed = {};
  Object.keys(obj).forEach(function(key) {
    var i, r = new RegExp(reg, 'g');
    var value = obj[key];
    var o = {
      deps: [],
      template: value
    };
    
    while(i = r.exec(value)) {
      if (obj[i[1]]) {
        o.deps.push(i[1]);
      }
    }
    parsed[key] = o;
  });
  return parsed;
}

function parseMixin(mixin) {
  var result = {};
  Object.keys(mixin).forEach(function(key) {
    result[key] = {value: mixin[key]};
  });
  return result;
}

function run (src, options) {
  var result = {}, re = new RegExp(options.reg, 'g');

  var data = options.mixin;
  for (var j in src) {
    data[j] = src[j];
  }

  for (var i in src) {
    next(src[i]);
    result[i] = src[i].value;
  }

  return result;

  function next(a) {
    if (a.value) {return;}
    if (a._running) {throw new Error('Recursive dependency');}

    a._running = true;
    a.deps.forEach(function(item) {
      next(src[item]);
    });

    a.value = template(a);
    delete a._running;
  }

  function template(self) {
    var tpl = self.template;
    return typeof tpl !== 'string' ? tpl :
      tpl.replace(re, function(all, match) {
        return data[match] ? data[match].value : all;
      });
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
