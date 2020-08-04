'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export darkcore-lib', function() {
    var darkcore = require('../');
    should.exist(darkcore.lib);
    should.exist(darkcore.lib.Transaction);
    should.exist(darkcore.lib.Block);
  });
});
