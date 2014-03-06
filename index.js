module.exports = zhi;

function zhi (obj, options) {
  if (!isObject(obj)) return null;

  options || (options = {});
  if (typeof options.tagStart !== 'string') options.tagStart = '{{';
  if (typeof options.tagEnd !== 'string') options.tagEnd = '}}';
  var reg = [
    options.tagStart.replace(/([\$\/\+\!\*])/g, '\\$1'),
    '\\s*([\\w.-]+)\\s*',
    options.tagEnd
  ].join('');

  return run(parse(obj, reg), reg);
}

function parse (obj, reg) {
  var parsed = {};
  Object.keys(obj).forEach(function(key) {
    var i, r = new RegExp(reg, 'g');
    var value = obj[key];
    var o = {
      args: [],
      deps: [],
      template: value
    };
    
    while(i = r.exec(value)) {
      o.args.push(i[1]);
      if (obj[i[1]]) {
        o.deps.push(i[1]);
      }
    }
    parsed[key] = o;
  });
  return parsed;
}

function run (obj, reg) {
  var result = {}, re = new RegExp(reg, 'g');

  for (var i in obj) {
    next(obj[i]);
    result[i] = obj[i].value;
  }

  return result;

  function next(a) {
    if (a.value) return;
    if (a._running) throw new Error('Recursive dependency');

    a._running = true;
    a.deps.forEach(function(item) {
      if (!obj[item].value) next(obj[item]);
    });

    a.value = template(a, obj);
    delete a._running;
  }

  function template(self, obj) {
    var tpl = self.template;
    return tpl.replace(re, function(all, match) {
      return obj[match] ? obj[match].value : all;
    });
  }
}



function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
