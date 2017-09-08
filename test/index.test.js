'use strict';

const assert = require('assert');
const zhi = require('..');

describe('Zhi', function() {
  it('Normal use', function() {
    assert.deepEqual(zhi({
      a: '{{b}}/{{c}}',
      b: '123',
      c: '{{d}}',
      d: 'abc',
    }), {
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc',
    });
  });

  it('with space', function() {
    assert.deepEqual(zhi({
      a: '{{ b}}/{{c }}',
      b: '123',
      c: '{{  d  }}',
      d: 'abc',
    }), {
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc',
    });
  });

  it('not exist', function() {
    assert.deepEqual(zhi({
      a: '{{b}}/{{c}}',
      b: '123',
    }), {
      a: '123/{{c}}',
      b: '123',
    });
  });

  it('Recursive dependency', function() {
    assert.throws(function() {
      zhi({
        a: '{{b}}/{{c}}',
        b: '123',
        c: '{{d}}',
        d: '{{a}}',
      });
    }, 'Recursive dependency');
  });

  it('specify tag', function() {
    assert.deepEqual(zhi({
      a: '<%b%>/<%c%>',
      b: '123',
      c: '<%d%>',
      d: 'abc',
    }, {
      tagStart: '<%',
      tagEnd: '%>',
    }), {
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc',
    });
  });

  it('more tag test', function() {
    assert.deepEqual(zhi({
      a: '$b/${c}d',
      b: '123',
      c: '-${d }-',
      d: 'abc',
    }, {
      tagStart: '${?',
      tagEnd: '}?',
    }), {
      a: '123/-abc-d',
      b: '123',
      c: '-abc-',
      d: 'abc',
    });
  });

  it('use mixin data', function() {
    assert.deepEqual(zhi({
      a: '{{b}}/{{c}}',
      b: '{{x}}{{y}}{{z}}',
      c: '{{d}}',
      d: 'abc',
    }, {
      mixin: {
        x: '1',
        y: '2',
        z: '3',
      },
    }), {
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc',
    });
  });

  it('mixin data has lower priority', function() {
    assert.deepEqual(zhi({
      a: '{{b}}',
      b: '1',
    }, {
      mixin: {
        b: '2',
      },
    }), {
      a: '1',
      b: '1',
    });
  });

  it('should be object', function() {
    assert(zhi('') === null);
  });

  it('should be type otherwise string', function() {
    assert.deepEqual(zhi({
      a: true,
      b: {},
    }), {
      a: true,
      b: {},
    });
  });

  it('should require self', function() {
    assert.deepEqual(zhi({
      a: '{{a}}',
      b: '{{a}}',
    }), {
      a: '{{a}}',
      b: '{{a}}',
    });
  });

  it('should require self when mixin', function() {
    assert.deepEqual(zhi({
      a: '{{a}}',
      b: '{{a}}',
    }, {
      mixin: {
        a: 1,
      },
    }), {
      a: 1,
      b: 1,
    });
  });

});
