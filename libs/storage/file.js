/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function(){
    /**
     *
     * @param dir
     * @returns {{set: set, get: get, remove: remove}}
     * @constructor
     */
    function FileStorage (dir){
        var storage = _getEngineInstance(dir);

        return {
            set: set,
            get: get,
            remove: remove
        };

        /**
         * Getter
         *
         * @param key
         * @returns {*}
         */
        function get (key){
            return storage.getItemSync(key);
        }

        /**
         * Setter
         *
         * @param key
         * @param value
         * @returns {*}
         */
        function set (key, value){
            return storage.setItemSync(key, value);
        }

        /**
         * Removes item
         *
         * @param key
         * @returns {*}
         */
        function remove (key){
            return storage.removeItemSync(key);
        }

        /**
         * Sets up the file engine and returns an instance
         *
         * @param dir
         * @returns {*}
         * @private
         */
        function _getEngineInstance (dir){
            var engine = require('node-persist');
            engine.initSync({
                dir: dir
            });

            return engine;
        }
    }

    module.exports = FileStorage;
})();