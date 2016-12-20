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
        ipWhitelist = require('./utils/ip.whitelist'),
        access = require('./utils/access'),
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

    /**
     * Message type to function map
     */
    var messages = {
        'RESET_SHELTER': _reset,
        'SHELTER_UPDATE': _updateStats,
        'UPDATE_IP_WHITELIST': _updateIpWhitelist,
        'ALARM_TRIGGERED': _handleTrigger,
        'SEND_NOTIFICATION': _handlePushNotifications,
        'PROFILE_UPDATE': _updateClientProfile
    };

    /**
     * Handle registered messages
     *
     * @param message
     */
    PhpClient.prototype.handleMessage = function (message) {
	console.log(message.type);
        if ('undefined' !== messages[message.type]) {
            messages[message.type](message);
        }
    };

    /**
     * Handle shelter reset
     *
     * @param message
     * @private
     */
    function _reset(message) {
        // reset triggered clients for a specific shelter
        var triggers = storage.get('triggers') || {};
        triggers[message.dst] = {};
        storage.set('triggers', triggers);

        messageProxy.forward({id: message.dst}, {
            type: 'RESET',
            data: 1
        });

        messageProxy.forward({ shelterId: message.dst }, {
            type: 'SHELTER_RESET',
            data: 1
        }, true);

        debug.log('Shelter reset: with id ' + message.dst);
        debug.separate();
    }

    /**
     * Update Shelter stats
     *
     * @param message
     * @private
     */
    function _updateStats(message) {
        messageProxy.forward({id: message.dst}, message);
    }

    /**
     * Update IP Whitelist
     *
     * Recheck all connected shelters and
     * disconnect those that aren't assigned to schools
     *
     * @param message
     * @private
     */
    function _updateIpWhitelist(message) {
        ipWhitelist.update(message.data);
        access.check();
    }

    /**
     * Handle trigger message
     *
     * @param message
     * @private
     */
    function _handleTrigger(message) {
        // check if devices has triggered already
        // if yes, don't forward the message and leave it
        // to device to handle it
        var triggers = storage.get('triggers') || {},
            triggered = false;

        if ('undefined' !== typeof triggers[message.dst]) {
            if ('undefined' !== typeof triggers[message.dst][message.src]) {
                triggered = triggers[message.dst][message.src];
            }
        }

        // if a client hasn't already triggered,
        // update its profile and notify shelter
        if (!triggered) {
            clientState.setTriggered(message.src, message.dst);
        }
    }

    /**
     * Forward push notifications to PC Apps
     *
     * @param message
     * @private
     */
    function _handlePushNotifications(message) {
        var receivers = message.receivers,
            index = 0;

        for (index; index < receivers.length; index++) {
            message.dst = receivers[index];

            messageProxy.forward({
                id: receivers[index]
            }, message, true);
        }
    }

    /**
     * Update in-storage client profile
     *
     * @param message
     * @private
     */
    function _updateClientProfile(message) {
        profile.set(message.data.profile.device_id, message.data);
    }

    module.exports = PhpClient;
})();
