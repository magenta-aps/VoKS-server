/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    'use strict';

    function ClientFactory() {
        var uri = require('../../utils/uri'),
            MobileClient = require('./mobile'),
            ShelterClient = require('./shelter'),
            PhpClient = require('./php'),
            DesktopClient = require('./desktop');

        return {
            createClient: createClient
        };

        function createClient(socket) {
            var clientType = _getClientParameters(socket.upgradeReq.url),
                client;

            if (clientType.isMobile()) {
                client = new MobileClient(clientType.clientId, clientType.shelterId, socket);
            } else if (clientType.isDesktopApp()) {
                client = new DesktopClient(clientType.clientId, clientType.shelterId, socket, clientType.invalidateCache);
            } else if (clientType.isShelter()) {
                client = new ShelterClient(clientType.clientId, clientType.shelterId, socket);
            } else if (clientType.isPhpClient()) {
                client = new PhpClient(clientType.clientId, clientType.shelterId, socket);
            }

            return client;
        }


        function _getClientParameters(url) {
            var _client,
                clientId,
                shelterId,
                invalidateCache = 0,
                path = uri.split(url);

            // if the second argument isn't available, it's the php-client
            if ('undefined' === typeof path[1]) {
                if (path[0] === 'php-client') {
                    _client = 'php';
                    path[1] = 'php';
                }
            }

            // the 3rd parameter notifies about trigger cache invalidation
            if ('undefined' !== typeof path[2]) {
                invalidateCache = parseInt(path[2], 10) === 0 ? true : false;
            }

            shelterId = path[0];
            clientId = path[1];

            // figure out what client it is based on
            if (clientId === shelterId) {
                _client = 'shelter';
            } else if (clientId.match('_android') || clientId.match('_ios')) {
                _client = 'mobile';
            } else if (clientId.match('_desktop')) {
                _client = 'desktop';
            }

            return {
                isShelter: isShelter,
                isDesktopApp: isDesktopApp,
                isMobile: isMobile,
                isPhpClient: isPhpClient,
                device: _client,
                clientId: clientId,
                shelterId: shelterId,
                invalidateCache: invalidateCache
            };

            function isShelter() {
                return 'shelter' === _client;
            }

            function isDesktopApp() {
                return 'desktop' === _client;
            }

            function isMobile() {
                return 'mobile' === _client;
            }

            function isPhpClient() {
                return 'php' === _client;
            }


        }

    }

    module.exports = ClientFactory();
})();