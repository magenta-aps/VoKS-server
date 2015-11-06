/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    function ClientProfile() {
        var storage = container.get('storage'),
            _profiles = storage.get('profiles') || {};

        return {
            set: set,
            get: get
        };

        function set(clientId, data) {
            _profiles[clientId] = data;
            storage.set('profiles', _profiles);
        }

        function get(clientId) {
            if (undefined !== _profiles[clientId]) {
                return _profiles[clientId];
            }

            return {};
        }
    }

    module.exports = ClientProfile();
})();