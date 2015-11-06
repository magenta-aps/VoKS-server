/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    function Container() {
        var _components = {};

        /**
         * Registers a component
         *
         * @param key
         * @param object
         */
        this.register = function(key, object) {
            _components[key] = object;
            return this;
        };

        /**
         * Gets a registered component
         * @param key
         * @returns {*}
         */
        this.get = function(key) {
            if (typeof _components[key] !== 'undefined') {
                return _components[key];
            }

            throw key + ' component doesn\'t exist';
        }
    }

    module.exports = new Container();
})();