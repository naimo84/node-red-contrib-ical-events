(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['should'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('should'));
  } else {
    factory(should);
  }
}(function (should) {
  var Assertion = should.Assertion;

  Assertion.add('sinonStub', function() {
    this.params = { operator: 'to be sinon stub' };

    this.is.not.null().and.not.undefined();

    var method = this.obj;
    if(method.proxy && method.proxy.isSinonProxy) {
      method = method.proxy;
    }
    method.should.be.a.Function()
      .and.have.property('getCall')
        .which.is.a.Function();
  });

  function isStub(stub) {
    if (!stub) {
      return false;
    }

    if (method.proxy && method.proxy.isSinonProxy) {
            verifyIsStub(method.proxy);
        } else {
            if (typeof method !== "function") {
                assert.fail(method + " is not a function");
            }

            if (typeof method.getCall !== "function") {
                assert.fail(method + " is not stubbed");
            }
        }
  }

  function timesInWords(count) {
    switch (count) {
      case 1:
          return "once";
      case 2:
          return "twice";
      case 3:
          return "thrice";
      default:
          return (count || 0) + " times";
    }
  }

  function isCall(call) {
    return call && isSpy(call.proxy);
  }

  function isSpy(spy) {
    return typeof spy === "function" &&
           typeof spy.getCall === "function" &&
           typeof spy.calledWithExactly === "function";
  }

  function proxySinonBooleanProperty(name, message) {
    Assertion.add(name, function() {
      var obj = this.obj;

      if(!isSpy(obj) && !isCall(obj)) {
        this.params = { obj: obj.toString(), operator: 'to be sinon spy or spy call' };
        this.fail();
      }
      if(isCall(obj)) {
        obj = obj.proxy;
      }

      this.params = { obj: obj.toString(), operator: obj.printf(message) };

      should(obj[name]).be.true();
    });
  }

  function proxySinonMethod(name, message) {
    Assertion.add(name, function() {
      var obj = this.obj;

      if(!isSpy(obj) && !isCall(obj)) {
        this.params = { obj: obj.toString(), operator: 'to be sinon spy or spy call' };
        this.fail();
      }
      if(isCall(obj)) {
        obj = obj.proxy;
      }

      var args = Array.prototype.slice.call(arguments);
      args.unshift(message);

      this.params = { obj: obj.toString(), operator: obj.printf.apply(obj, args) };

      should(obj[name].apply(obj, arguments)).be.true();
    });
  }

  /**
   * Assert stub was called at least once
   *
   * @name called
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var callback = sinon.spy();
   * callback();
   * callback.should.be.called();
   */
  proxySinonBooleanProperty('called', 'to have been called, but was called %c');

  /**
   * Assert stub was called at exactly once
   *
   * @name calledOnce
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var callback = sinon.spy();
   * callback();
   * callback.should.be.calledOnce();
   */
  proxySinonBooleanProperty('calledOnce', 'to be called once but was called %c%C');

  /**
   * Assert stub was called at exactly twice
   *
   * @name calledTwice
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var callback = sinon.spy();
   * callback();
   * callback();
   * callback.should.be.calledTwice();
   */
  proxySinonBooleanProperty('calledTwice', 'to be called twice but was called %c%C');

  /**
   * Assert stub was called at exactly thrice
   *
   * @name calledThrice
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var callback = sinon.spy();
   * callback();
   * callback();
   * callback();
   * callback.should.be.calledThrice();
   */
  proxySinonBooleanProperty('calledThrice', 'to be called thrice but was called %c%C');

  /**
   * Assert stub was called with given object as this
   *
   * @name calledOn
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {*} obj - object that was used as this
   * @example
   *
   * var callback = sinon.spy();
   * var obj = {};
   * callback.call(obj);
   * callback.should.be.calledOn(obj);
   */
  proxySinonMethod('calledOn', 'to be called with %1 as this but was called with %t');

  /**
   * Assert stub was called with given object as this always. So if you call stub several times
   * all should be with the same object
   *
   * @name alwaysCalledOn
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {*} obj - object that was used as this
   * @example
   *
   * var callback = sinon.spy();
   * var obj = {};
   * callback.call(obj);
   * callback.should.be.alwaysCalledOn(obj);
   */
  proxySinonMethod('alwaysCalledOn', 'to always be called with %1 as this but was called with %t');

  /**
   * Asserts that stub was called with new
   *
   * @name calledWithNew
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var Class = sinon.spy();
   *
   * var c = new Class();
   *
   * Class.should.be.calledWithNew;
   */
  proxySinonMethod('calledWithNew', 'to be called with new');

  /**
   * @name alwaysCalledWithNew
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @example
   *
   * var Class = sinon.spy();
   *
   * var c1 = new Class();
   * var c2 = new Class();
   *
   * Class.should.be.alwaysCalledWithNew;
   */
  proxySinonMethod('alwaysCalledWithNew', 'to always be called with new');

  /**
   * Asserts that stub was called with given arguments
   *
   * @name calledWith
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   * @example
   *
   * var callback = sinon.spy();
   *
   * callback(1, 2, 3);
   *
   * callback.should.be.calledWith(1, 2, 3);
   */
  proxySinonMethod('calledWith', 'to be called with arguments %*%C');

  /**
   * @name alwaysCalledWith
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   * @example
   *
   * var callback = sinon.spy();
   *
   * callback(1, 2, 3);
   *
   * callback.should.be.alwaysCalledWith(1, 2, 3);
   */
  proxySinonMethod('alwaysCalledWith', 'to always be called with arguments %*%C');

  /**
   * Returns true if the spy/stub was never called with the provided arguments.
   *
   * @name neverCalledWith
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   * @example
   *
   * var callback = sinon.spy();
   *
   * callback(1, 2, 3);
   *
   * callback.should.be.neverCalledWith(1, 2, 3);
   */
  proxySinonMethod('neverCalledWith', 'to never be called with arguments %*%C');

  /**
   * Returns true if spy was called with matching arguments (and possibly others).
   *
   * @name calledWithMatch
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   */
  proxySinonMethod('calledWithMatch', 'to be called with match %*%C');

  /**
   * Returns true if spy was always called with matching arguments (and possibly others).
   *
   * @name alwaysCalledWithMatch
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   */
  proxySinonMethod('alwaysCalledWithMatch', 'to always be called with match %*%C');

  /**
   * Returns true if the spy/stub was never called with matching arguments.
   *
   * @name neverCalledWithMatch
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   */
  proxySinonMethod('neverCalledWithMatch', 'to never be called with match %*%C');

  /**
   * Returns true if call received provided arguments and no others.
   *
   * @name calledWithExactly
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   */
  proxySinonMethod('calledWithExactly', 'to be called with exact arguments %*%C');

  /**
   * Passes if the spy was always called with the provided arguments and no others.
   *
   * @name alwaysCalledWithExactly
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {...*} args - arguments that was used for calling
   */
  proxySinonMethod('alwaysCalledWithExactly', 'to always be called with exact arguments %*%C');

  /**
   * Passes if the spy threw the given exception. The exception can be a
   * string denoting its type, or an actual object. If no argument is
   * provided, the assertion passes if the spy ever threw any exception.
   *
   * @name threw
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {string|Error} ex - exception to be thrown
   */
  proxySinonMethod('threw', 'to throw exception%C');

  /**
   * Passes if the spy always threw the given exception. The exception can be a
   * string denoting its type, or an actual object. If no argument is
   * provided, the assertion passes if the spy ever threw any exception.
   *
   * @name alwaysThrew
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {string|Error} ex - exception to be thrown
   */
  proxySinonMethod('alwaysThrew', 'to always throw exception%C');

  /**
   * Assert stub was called at exact number of times
   *
   * @name callCount
   * @memberOf Assertion
   * @category assertion stubs
   * @module should-sinon
   * @param {Number} count - number of calles
   * @example
   *
   * var callback = sinon.spy();
   * callback.should.have.callCount(0);
   * callback();
   * callback.should.have.callCount(1);
   * callback();
   * callback.should.have.callCount(2);
   */
  Assertion.add('callCount', function(count) {
    var obj = this.obj;

    if(!isSpy(obj) && !isCall(obj)) {
      this.params = { obj: obj.toString(), operator: 'to be sinon spy or spy call' };
      this.fail();
    }
    if(isCall(obj)) {
      obj = obj.proxy;
    }

    this.params = { operator: obj.printf('to be called ' + timesInWords(count) + ' but was called %c%C' )};

    this.assert(obj.callCount === count);
  });

}));
