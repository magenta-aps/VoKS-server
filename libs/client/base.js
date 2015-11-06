/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    function BaseClient(id, shelterId, connection) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;
        this.triggered = false;
        this.active = true;
        this.closed = false;
        this.pingTimeout = null;
        this.pongTimeout = null;
    }

    BaseClient.prototype.sendMessage = function (data) {
        // the only way to suppress the error
        // and not killing the process is to wrap
        // it in a try catch block
        try {
            this.connection.send(JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    };

    BaseClient.prototype.onConnection = function () {

    };

    BaseClient.prototype.handleMessage = function () {

    };

    BaseClient.prototype.onDisconnect = function () {

    };

    BaseClient.prototype.hasClosedConnection = function () {
        return this.closed;
    };

    module.exports = BaseClient;
})();