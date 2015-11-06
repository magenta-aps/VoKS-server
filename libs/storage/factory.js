/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */
(function(){

    /**
     * Storage engine factory
     *
     * @returns {{getEngine: getEngine}}
     * @constructor
     */
    function StorageFactory (){

        return {
            getEngine: getEngine
        };

        /**
         * Returns the required storage engine
         *
         * @param engine
         * @returns {*}
         */
        function getEngine (engine){
            if ('file' === engine) {
                return require('./file.js')('cache');
            }

            throw engine + ' storage engine is not available.';
        }
    }

    module.exports = StorageFactory();
})();