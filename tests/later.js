/*global describe, it */
"use strict";
var should = require('chai').should();
Object.prototype.each = function (fn, context) {
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            fn.call(context, this[key], key, this);
        }
    }
    return this;
};

var timers = require("../index.js"),
    merge = function (obj1, obj2) {
        obj2.each(function (value, key) {
            if (!(key in obj1)) {
                obj1[key] = obj2[key];
            }
        });
    };

describe('Testing later-method', function () {
    describe('without repeat', function () {
        it('later', function (done) {
            var count = 0;
            timers.later(function() {
                count++;
            }, 100);
            // purposly, check after >2x timeout --> count should only increase 1x
            setTimeout(function() {
                count.should.be.equal(1);
                done();
            }, 220);
        });
        it('canceled later', function (done) {
            var count = 0;
            var handle = timers.later(function() {
                count++;
            }, 100);
            setTimeout(function() {
                handle.cancel();
            }, 10);
            setTimeout(function() {
                count.should.be.equal(0);
                done();
            }, 120);
        });
        it('without timeout', function (done) {
            var count = 0,
                countbefore;
            timers.later(function() {
                count++;
            });
            // also check `countbefore` --> in case later doesn't run asynchronously,
            // count will be 1 at this stage (which has to be 0)
            countbefore = count;
            setTimeout(function() {
                count.should.be.equal(1);
                countbefore.should.be.equal(0);
                done();
            }, 15);
        });
        it('canceled without timeout', function (done) {
            var count = 0;
            var handle = timers.later(function() {
                count++;
            });
            handle.cancel();
            setTimeout(function() {
                count.should.be.equal(0);
                done();
            }, 15);
        });
    });
    describe('repeated', function () {
        it('later repeated every 100ms, check at 50ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 100, true);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(0);
                done();
            }, 50);
        });
        it('later repeated every 100ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 100, true);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(2);
                done();
            }, 220);
        });
        it('later repeated every 100ms canceled at 50ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 100, true);
            setTimeout(function() {
                handle.cancel();
            }, 50);
            setTimeout(function() {
                count.should.be.equal(0);
                done();
            }, 220);
        });
        it('later repeated every 100ms canceled at 250ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 100, true);
            setTimeout(function() {
                handle.cancel();
            }, 250);
            setTimeout(function() {
                count.should.be.equal(2);
                done();
            }, 420);
        });
    });
    describe('repeated with different first interval', function () {
        it('later first 50ms, repeated every 100ms, check at 25ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(0);
                done();
            }, 25);
        });
        it('later first 50ms, repeated every 100ms, check at 75ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(1);
                done();
            }, 75);
        });
        it('later first 50ms, repeated every 100ms, check at 125ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(1);
                done();
            }, 125);
        });
        it('later first 50ms, repeated every 100ms, check at 175ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(2);
                done();
            }, 175);
        });
        it('later first 50ms, repeated every 100ms, check at 225ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(2);
                done();
            }, 225);
        });
        it('later first 50ms, repeated every 100ms, check at 275ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(3);
                done();
            }, 275);
        });
        it('later first 50ms, repeated every 100ms canceled at 25ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
            }, 25);
            setTimeout(function() {
                count.should.be.equal(0);
                done();
            }, 325);
        });
        it('later first 50ms, repeated every 100ms canceled at 125ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                console.log(count);
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
            }, 125);
            setTimeout(function() {
                count.should.be.equal(1);
                done();
            }, 325);
        });
        it('later first 50ms, repeated every 100ms canceled at 300ms', function (done) {
            var count = 0,
                handle;
            handle = timers.later(function() {
                count++;
            }, 50, 100);
            setTimeout(function() {
                handle.cancel();
            }, 300);
            setTimeout(function() {
                count.should.be.equal(3);
                done();
            }, 325);
        });
        it('check context without interval', function (done) {
            var a = {},
                fn = function() {
                    (this === a).should.be.true;
                    done();
                };
            timers.later(fn.bind(a), 0);
        });
        it('check context with interval', function (done) {
            var a = {},
                fn = function() {
                    (this === a).should.be.true;
                },
                handle = timers.later(fn.bind(a), 25, true);
            setTimeout(function() {
                handle.cancel();
                done();
            }, 80);
        });
        it('check going to async', function (done) {
            timers.later(done);
        });

        it('check if _afterAsyncFn is invoked', function (done) {
            var I = {};
            merge(I, timers);
            I._afterAsyncFn = function() {
                done();
            };
            I.later(function() {}, 10);
        });

        it('check if _afterAsyncFn is invoked with true param', function (done) {
            var I = {};
            merge(I, timers);
            I._afterAsyncFn = function() {
                done();
            };
            I.later(function() {}, 10, false, true);
        });

        it('check if _afterAsyncFn is invoked with false param', function (done) {
            var I = {};
            merge(I, timers);
            I._afterAsyncFn = function() {
                done(new Error('_afterAsyncFn got invoked but should not have'));
            };
            I.later(function() {}, 10, false, false);
            setTimeout(done, 50);
        });

        it('check if _afterAsyncFn is invoked with interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
            };
            handle = I.later(function() {}, 25, true);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(3);
                done();
            }, 90);
        });

        it('check if _afterAsyncFn is invoked with true param with interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
            };
            handle = I.later(function() {}, 25, true, true);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(3);
                done();
            }, 90);
        });

        it('check if _afterAsyncFn is invoked with false param with interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
                done(new Error('_afterAsyncFn got invoked but should not have'));
            };
            handle = I.later(function() {}, 25, true, false);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(0);
                done();
            }, 90);
        });

        it('check if _afterAsyncFn is invoked with different interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
            };
            handle = I.later(function() {}, 25, 26);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(3);
                done();
            }, 90);
        });

        it('check if _afterAsyncFn is invoked with true param with different interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
            };
            handle = I.later(function() {}, 25, 26, true);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(3);
                done();
            }, 90);
        });

        it('check if _afterAsyncFn is invoked with false param with different interval', function (done) {
            var I = {},
                handle,
                count = 0;
            merge(I, timers);
            I._afterAsyncFn = function() {
                count++;
                done(new Error('_afterAsyncFn got invoked but should not have'));
            };
            handle = I.later(function() {}, 25, 26, false);
            setTimeout(function() {
                handle.cancel();
                count.should.be.equal(0);
                done();
            }, 90);
        });

    });
});
