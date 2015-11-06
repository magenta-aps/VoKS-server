/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function(){

    // environmental confuguration
    var env = require('../configs/env');

    /**
     * Queue class which stores messages and backs everything into files
     *
     * @returns {{add: add, get: get, remove: remove}}
     * @constructor
     */
    function Queue (storage, _key){
        _key = _key || 'queue';

        var items = storage.get(_key) || [];

        return {
            add: add,
            get: get,
            remove: remove,
            getAll: getAll
        };

        /**
         * Adds a message to the queue
         *
         * @param destinationId - recipient id
         * @param message - message object/json
         * @param ttl - time to live in seconds. after this time the
         *              message should expire and be removed
         */
        function add (destinationId, message, ttl){
            ttl = ttl || env.cacheTtl;

            items.push({
                destinationId: destinationId,
                message: message,
                ttl: Date.now() + (ttl * 1000)
            });

            storage.set(_key, items);
        }

        /**
         * Get messages for a particular client
         *
         * @param destinationId
         * @returns {Array}
         */
        function get (destinationId){
            var matching = [],
                expired = [],
                index;

            for (index = 0; index < items.length; index++) {
                if (items[ index ].destinationId === destinationId) {
                    if (!_hasExpired(items[ index ].ttl)) {
                        matching.push(items[ index ]);
                    } else {
                        // set this message as expired
                        expired.push(items[ index ]);
                    }
                }
            }

            // clean up expired messages
            _cleanup(expired);

            return matching;
        }

        /**
         * Get all cached messages
         *
         * @returns {*}
         */
        function getAll() {
            return storage.get(_key);
        }

        /**
         * Removes a message from queue
         *
         * @param message
         */
        function remove (message){
            var index;

            for (index = 0; index < items.length; index++) {
                if (message === items[ index ]) {
                    items.splice(index, 1);
                    storage.set(_key, items);
                    break;
                }
            }
        }

        /**
         * Removes expired messages
         *
         * @param expired
         * @private
         */
        function _cleanup (expired){
            var index;

            for (index = 0; index < expired.length; index++) {
                remove(expired[ index ]);
            }
        }

        /**
         * Checks if a timestamp is expired
         *
         * @param ttl
         * @returns {boolean}
         * @private
         */
        function _hasExpired (ttl){
            return ttl - Date.now() <= 0;
        }
    }

    module.exports = Queue;
})();