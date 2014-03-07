require('should');
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
});
