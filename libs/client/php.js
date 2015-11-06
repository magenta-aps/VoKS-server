/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    var BaseModel = require('./base'),
        extend = require('../../utils/extend'),
        messageProxy = require('../message.proxy'),
        profile = container.get('profile'),
        storage = container.get('storage'),
        debug = container.get('debug'),
        clientState = require('./utils/states');

    function PhpClient(id, shelterId, connection) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;
    }

    extend(BaseModel, PhpClient);

    PhpClient.prototype.handleMessage = function (message) {
        if ('RESET_SHELTER' === message.type) {

            var triggers = storage.get('triggers') || {};
            triggers[message.dst] = {};
            storage.set('triggers', triggers);

            messageProxy.forward({id: message.dst}, {
                type: 'RESET',
                data: 1
            });

            messageProxy.forward({shelterId: message.dst}, {
                type: 'SHELTER_RESET',
                data: 1
            }, true);

            debug.log('Shelter reset: with id ' + message.dst);
            debug.separate();

        } else if ('SHELTER_UPDATE' === message.type) {

            messageProxy.forward({id: message.dst}, message);

        } else if ('ALARM_TRIGGERED' === message.type) {

            // check if devices has triggered already
            // if yes, don't forward the message and leave it
            // to device to handle it
            var triggers = storage.get('triggers') || {},
                triggered = false;

            if (undefined !== triggers[message.dst]) {
                if (undefined !== triggers[message.dst][message.src]) {
                    triggered = triggers[message.dst][message.src];
                }
            }

            if(!triggered) {
                clientState.setTriggered(message.src, message.dst);
                debug.log('Alarm triggered: ' + 'client ' + message.src + ' to #' + message.dst + ' shelter');
            }
        } else if ('SEND_NOTIFICATION' === message.type) {
            var receivers = message.receivers,
                index = 0;

            for (index; index < receivers.length; index++) {
                message.dst = receivers[index];

                messageProxy.forward({
                    id: receivers[index]
                }, message, true);
            }
        } else if ('PROFILE_UPDATE' === message.type) {
            profile.set(message.data.profile.device_id, message.data);
        }
    };

    module.exports = PhpClient;
})();