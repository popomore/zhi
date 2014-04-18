var should = require('should');
var zhi = require('./');

describe('Zhi', function() {
  it('Normal use', function() {
    zhi({
      a: '{{b}}/{{c}}',
      b: '123',
      c: '{{d}}',
      d: 'abc'
    }).should.eql({
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc'
    });
  });

  it('with space', function() {
    zhi({
      a: '{{ b}}/{{c }}',
      b: '123',
      c: '{{  d  }}',
      d: 'abc'
    }).should.eql({
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc'
    });
  });

  it('not exist', function() {
    zhi({
      a: '{{b}}/{{c}}',
      b: '123'
    }).should.eql({
      a: '123/{{c}}',
      b: '123'
    });
  });

  it('Recursive dependency', function() {
    (function(){
      zhi({
        a: '{{b}}/{{c}}',
        b: '123',
        c: '{{d}}',
        d: '{{a}}'
      });
    }).should.throw('Recursive dependency');
  });

  it('specify tag', function() {
    zhi({
      a: '<%b%>/<%c%>',
      b: '123',
      c: '<%d%>',
      d: 'abc'
    }, {
      tagStart: '<%',
      tagEnd: '%>'
    }).should.eql({
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc'
    });
  });

  it('more tag test', function() {
    zhi({
      a: '$b/${c}d',
      b: '123',
      c: '-${d }-',
      d: 'abc'
    }, {
      tagStart: '${?',
      tagEnd: '}?'
    }).should.eql({
      a: '123/-abc-d',
      b: '123',
      c: '-abc-',
      d: 'abc'
    });
  });

  it('use mixin data', function() {
    zhi({
      a: '{{b}}/{{c}}',
      b: '{{x}}{{y}}{{z}}',
      c: '{{d}}',
      d: 'abc'
    }, {
      mixin: {
        'x': '1',
        'y': '2',
        'z': '3'
      }
    }).should.eql({
      a: '123/abc',
      b: '123',
      c: 'abc',
      d: 'abc'
    });
  });

  it('mixin data has lower priority', function() {
    zhi({
      a: '{{b}}',
      b: '1'
    }, {
      mixin: {
        b: '2'
      }
    }).should.eql({
      a: '1',
      b: '1'
    });
  });

  it('should be object', function() {
    should(zhi('')).be.exactly(null);
  });

  it('should be type otherwise string', function() {
    zhi({
      a: true,
      b: {}
    }).should.eql({
      a: true,
      b: {}
    });
  });
});
