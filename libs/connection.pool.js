/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */
(function () {

    /**
     *
     * @returns {{add: add, remove: remove, filter: (function(Array, (string|Object|function()), (function(actual, expected)|true|undefined)))}}
     * @constructor
     */
    function ConnectionPool() {

        var _clients = [];

        return {
            add: add,
            get: get,
            getAll: getAll,
            remove: remove,
            filter: filter,
            update: update,
            getShelterClients: getShelterClients
        };

        /**
         *
         * @param client
         */
        function add(client) {
            _clients.push(client);
        }

        /**
         *
         * @param clientId
         * @returns {*}
         */
        function get(clientId) {
            var clients = filter({
                id: clientId
            });

            if (clients.length === 1) {
                return clients[0];
            }

            return false;
        }

        /**
         * Get all clients
         *
         * @returns {Array}
         */
        function getAll() {
            return _clients;
        }

        /**
         * Finds and updates clients
         *
         * @param properties
         * @param update
         */
        function update(properties, update) {
            var matched = filter(properties),
                index = 0;

            for (index; index < matched.length; index++) {
                for (var key in update) {
                    matched[index][key] = update[key];
                }
            }
        }

        /**
         *
         * @param properties
         * @returns {Array}
         */
        function filter(properties) {
            var matched = [],
                index = 0;

            for (index; index < _clients.length; index++) {
                var found = 0;
                for (var key in properties) {
                    if (_clients[index][key] === properties[key]) {
                        found++;
                    }
                }

                if (found === Object.keys(properties).length) {
                    matched.push(_clients[index]);
                }
            }

            return matched;
        }

        /**
         * Returns all connected shelter clients
         *
         * @returns {Array}
         */
        function getShelterClients() {
            var matched = [],
                index = 0;

            for (index; index < _clients.length; index++) {
                if (_clients[index].id === _clients[index].shelterId) {
                    matched.push(_clients[index]);
                }
            }

            return matched;
        }

        /**
         *
         * @param client
         */
        function remove(client) {
            var index;

            for (index = 0; index < _clients.length; index++) {
                if (_clients[index] === client) {
                    _removeByIndex(index);
                    break;
                }
            }
        }

        /**
         * Removes a client by index
         *
         * @param index
         * @private
         */
        function _removeByIndex(index) {
            _clients.splice(index, 1);
        }
    }

    module.exports = new ConnectionPool();
})();