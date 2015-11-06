/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    function extend(ParentClass, ChildClass) {
        ChildClass.prototype = new ParentClass();
        ChildClass.prototype.constructor = ChildClass;
    }

    module.exports = extend;
})();