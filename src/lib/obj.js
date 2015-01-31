var _ = require('underscore');

/**
 * return a copy of object with each property 'locked'
 */
function lock(obj) {
    
   var locked = {};

   _.each(obj, function(element, index) {
        Object.defineProperty(locked, index, {
            writable: false,
            configurable: false,
            enumerable: true,
            value: element
        });
   });

   return locked;

}

module.exports.lock = lock;
