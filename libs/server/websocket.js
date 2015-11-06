/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */
(function () {
    'use strict';

    function Websockets(httpServer) {
        var debug = container.get('debug'),
            ClientFactory = require('../client/factory'),
            httpConfig = require('../../configs/http'),
            connectionPool = require('../connection.pool');

        return {
            start: start
        };

        function start() {
            var ws = require('ws').Server;

            var server = new ws({
                server: httpServer
            });

            server.on('connection', onConnection);
            server.on('error', onError);

            debug.separate();
            debug.warn('Started Websocket server');
            debug.separate();
            debug.warn('Listening port: ' + (httpConfig.secure.enabled ? httpConfig.secure.port : httpConfig.port));
            debug.separate();

            function onConnection(socket) {
                var client = ClientFactory.createClient(socket);
                connectionPool.add(client);
                client.onConnection();

                socket.on('message', function(message) {
                    var message = JSON.parse(message),
                    response = client.handleMessage(message);
                    // if clients' message handler returns false, the message should
                    // be passed down to the general message handler
                });

                socket.on('close', function () {
                    // only notify shelter and the clients if the
                    // connection hasn't been closed manually
                    if(false === client.hasClosedConnection()) {
                        client.onDisconnect();
                    }
                    connectionPool.remove(client);
                });
            }

            function onError(error) {
                console.log('Connection error:', error);
            }
        }
    }

    module.exports = Websockets;

})();
