'use strict';

var createError = require('errno').create;

var DarkcoreNodeError = createError('DarkcoreNodeError');

var RPCError = createError('RPCError', DarkcoreNodeError);

module.exports = {
  Error: DarkcoreNodeError,
  RPCError: RPCError
};
