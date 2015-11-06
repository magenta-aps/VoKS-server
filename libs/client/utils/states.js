/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    function ClientStates() {
        var messageProxy = require('../../message.proxy'),
            connectionPool = require('../../connection.pool'),
            profile = container.get('profile'),
            debug = container.get('debug'),
            storage = container.get('storage');

        return {
            setTriggered: setTriggered
        };

        /**
         * Called when received a message from the php client
         *
         * @param clientId
         * @param shelterId
         */
        function setTriggered(clientId, shelterId) {

            connectionPool.update({
                id: clientId
            }, {
                triggered: true
            });

            var message = {};
            message.type = 'CLIENT_CONNECTED';
            message.profile = profile.get(clientId);
            message.src = clientId;
            message.dst = shelterId;

            messageProxy.forward({
                id: shelterId
            }, message);

            var triggers = storage.get('triggers') || {};
            if ('undefined' === typeof triggers[shelterId] || !triggers[shelterId]) {
                triggers[shelterId] = {};
            }

            triggers[shelterId][clientId] = true;
            storage.set('triggers', triggers);

            debug.log('Device triggered the alarm: with id ' + clientId + ' on shelter ' + shelterId);
            debug.separate();
        }
    }

    module.exports = ClientStates();
})();