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
        connectionPool = require('../connection.pool'),
        debug = container.get('debug'),
        env = require('../../configs/env'),
        storage = container.get('storage'),
        queue = container.get('queue'),
        profile = container.get('profile');

    /**
     * Device model constructor
     *
     * Sets up the required properties for the client
     *
     * @param id
     * @param shelterId
     * @param connection
     * @param invalidateCache
     * @constructor
     */
    function DeviceClient(id, shelterId, connection) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;
        this.invalidateCache = false;
    }

    extend(BaseModel, DeviceClient);

    /**
     * Sets current trigger status
     *
     * If the client has disconnected but has triggered
     * the alarm before (prior to a reset) we set the
     * triggered token to true
     */
    DeviceClient.prototype.setTriggerStatus = function () {
        var triggers = storage.get('triggers') || {};
        if (undefined !== triggers[this.shelterId]) {
            if (undefined !== triggers[this.shelterId][this.id]) {
                // unset from file storage
                if (true === this.invalidateCache) {
                    triggers[this.shelterId][this.id] = false;
                    storage.set('triggers', triggers);
                    this.triggered = false;
                } else {
                    this.triggered = triggers[this.shelterId][this.id];
                }
            }
        }

    };

    /**
     * Initializes the client on a new connection
     *
     * Once the client is connected multiple steps are taken:
     *  - Shelter is notified about the new connection
     *    if the client has triggered the alarm
     *
     *  - Server starts sending ping messages to ensure the client
     *    is connected during wifi switches and/or various network states
     *
     *  - Messages that were sent to the client while the client was
     *    offline are retrieved from the cache and resent to the client
     */
    DeviceClient.prototype.onConnection = function () {
        debug.log('Device connected: ' + (this.constructor.name) + ' with id ' + this.id);

        var shelter = connectionPool.get(this.shelterId);

        // update client with the current shelter status
        this.sendMessage({
            type: 'SHELTER_STATUS',
            data: shelter === false ? 0 : 1
        });

        // update trigger status
        this.setTriggerStatus();

        // start pinging the client
        this.ping();

        // if the client has already triggered the alarm
        // notify shelter about it
        if (this.triggered == true) {
            messageProxy.forward({
                id: this.shelterId
            }, {
                type: 'CLIENT_CONNECTED',
                src: this.id,
                profile: profile.get(this.id)
            });
        }

        // fetch all client messages from the cache
        // clean up and try to resend them again
        var messages = queue.get(this.id),
            index = 0;

        for (index; index < messages.length; index++) {
            queue.remove(messages[index]);
            messageProxy.forward({
                id: messages[index].destinationId
            }, messages[index].message, true);
        }
    };

    /**
     * Handles client disconnection
     *
     * Cleans up the ping/pong timeouts and notifies
     * the shelter about the disconnected client
     */
    DeviceClient.prototype.onDisconnect = function () {
        debug.log('Device disconnected: ' + (this.constructor.name) + ' with id ' + this.id);

        // notify shelter about client disconnection
        messageProxy.forward({
            id: this.shelterId
        }, {
            type: 'CLIENT_DISCONNECTED',
            src: this.id
        });

        clearTimeout(this.pingTimeout);
        clearTimeout(this.pongTimeout);
    };

    /**
     * Handle incoming messages
     *
     * @param message
     */
    DeviceClient.prototype.handleMessage = function (message) {
        if ('MESSAGE' === message.type) {
            // Profile
            var _profile = profile.get(message.src);
            if (undefined !== _profile.profile) {
                message.profile = {
                    name: _profile.profile.name
                };
            }

            messageProxy.forward({
                id: message.dst
            }, message, true);
        } else {
            if ('undefined' !== typeof message.dst) {
                messageProxy.forward({
                    id: message.dst
                }, message);
            } else if (message.type === 'PONG') {
                this.active = true;
                debug.log('Received ping from: ' + this.id);
            }
        }
    };

    /**
     * Sends a ping message to the client
     * and waits for a pong message
     *
     * if the client does not send a pong message
     * we kill the connection and notify the shelter
     * about disconnection
     */
    DeviceClient.prototype.ping = function () {
        var self = this;

        clearTimeout(self.pingTimeout);

        // send a ping message to the client
        self.pingTimeout = setTimeout(function () {
            self.active = false;
            debug.log('Sending ping to: ' + self.id);

            self.sendMessage({
                type: 'PING'
            });

            clearTimeout(self.pongTimeout);

            // enable a timeout which will check if the
            // client is active after a set period of time
            // if not, gracefully close the connection
            self.pongTimeout = setTimeout(function () {
                if (false === self.active) {
                    self.connection.emit('close');
                    self.connection.close(1000, 'Client is inactive');
                    self.closed = true;
                } else {
                    self.ping();
                }
            }, env.pingInterval);

        }, env.pingInterval);
    };

    /**
     * Returns whether the connection has already been closed
     *
     * @returns {boolean}
     */
    DeviceClient.prototype.hasClosedConnection = function () {
        return this.closed;
    };

    module.exports = DeviceClient;
})();