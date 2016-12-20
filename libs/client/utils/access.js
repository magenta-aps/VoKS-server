/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {

    function Access() {
        var connectionPool = require('../../connection.pool'),
            ipWhitelist = require('./ip.whitelist');

        return {
            check: check
        };

        /**
         * Called when received a message from the php client
         *
         * @param clientId
         * @param shelterId
         */
        function check(shelterId) {
            var clients;

            shelterId = shelterId || null;

            if (null === shelterId) {
                clients = connectionPool.getShelterClients();
            } else {
                clients = connectionPool.filter({id: shelterId});
            }

            for (var index = 0; index < clients.length; index++) {
                if (!ipWhitelist.check(clients[index].id, clients[index].getIpAddress())) {
                    clients[index].sendMessage({
                        type: 'RESET',
                        data: 1
                    });
                }
            }
        }
    }

    module.exports = Access();
})();