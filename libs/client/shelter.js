/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */
(function () {
    var BaseModel = require('./device'),
        extend = require('../../utils/extend'),
        messageProxy = require('../message.proxy'),
        debug = container.get('debug'),
        queue = container.get('queue');

    function ShelterClient(id, shelterId, connection) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;
    }

    extend(BaseModel, ShelterClient);

    ShelterClient.prototype.onConnection = function () {
        debug.log('Shelter connected: with id ' + this.id);

        messageProxy.forward({
            shelterId: this.id
        }, {
            type: 'SHELTER_STATUS',
            data: 1
        });

        this.ping();

        this.sendMessage({
            type: 'CLIENT_LIST_UPDATE',
            dst: this.shelterId,
            src: this.id,
            data: messageProxy.getTriggered({
                shelterId: this.id,
                triggered: true
            })
        });

        var messages = queue.get(this.id),
            index = 0;

        for (index; index < messages.length; index++) {
            queue.remove(messages[index]);
            messageProxy.forward({
                id: messages[index].destinationId
            }, messages[index].message, true);
        }
    };

    ShelterClient.prototype.onDisconnect = function () {
        debug.log('Shelter disconnected: with id ' + this.id);
        messageProxy.forward({
            shelterId: this.id
        }, {
            type: 'SHELTER_STATUS',
            data: 0
        });
    };

    module.exports = ShelterClient;
})();