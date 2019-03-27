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
            ipWhitelist = require('../client/utils/ip.whitelist'),
            access = require('../client/utils/access'),
            httpConfig = require('../../configs/http'),
            connectionPool = require('../connection.pool');

        return {
            start: start
        };

        function start() {
            var ws = require('ws').Server;

            var server = new ws({
                server: httpServer.server
            });

            server.on('connection', onConnection);
            server.on('error', onError);

            debug.separate();
            debug.warn('Started Websocket server');
            debug.separate();
            debug.warn('Listening port: ' + (httpConfig.secure.enabled ? httpConfig.secure.port : httpConfig.port));
            debug.separate();

            // update ip whitelist before starting the listener
            ipWhitelist.fetchUpdate();
            httpServer.listen();

            function onConnection(socket) {
                /**
                 * 1. pull ip list from systemIpCheck api
                 * 2. on new connection check if ip is whitelisted
                 * 3. on system school list ip change update whitelist
                 * 3.1. rerun the whitelist check
                 * 4. send reset messages to shelters that don't belong to the ip list
                 * 5(?). on front-end make sure no same tabs with shelter are open
                 */
                var clientDefinition = ClientFactory.createClient(socket),
                    client = clientDefinition.client,
                    properties = clientDefinition.properties;

                connectionPool.add(client);

                // if the client is shelter check if it's allowed to
                // connect based on the list of assigned ip
                // addresses to schools
                if(properties.isShelter()) {
                    var assigned = ipWhitelist.check(client.id, socket._socket.remoteAddress);
                    //
                    debug.warn('Client ID: ' + client.id);
                    debug.separate();
                    debug.warn('Remote Address: ' + socket._socket.remoteAddress);
                    debug.separate();

                    if(false === assigned) {
                        access.check(client.id);
                        debug.warn('not good');
                        return;
                    } else {
                        debug.warn('all good');
                    }
                    debug.separate();
                }

                client.onConnection();

                socket.on('message', function (message) {
                    var message = JSON.parse(message);

                    client.handleMessage(message);
                });

                socket.on('close', function () {
                    // only notify shelter and the clients if the
                    // connection hasn't been closed manually
                    if (false === client.hasClosedConnection()) {
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
