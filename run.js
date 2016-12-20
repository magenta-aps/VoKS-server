/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    var http = require('./libs/server/http'),
        websockets = require('./libs/server/websocket');

    /**
     * Initialize configurable dependencies
     * @TODO use DI
     */
    var QueueEngine = require('./libs/queue'),
        storage = require('./libs/storage/factory').getEngine('file'),
        queue = new QueueEngine(storage, 'messages'),
        debug = require('./libs/debug'),
        env = require('./configs/env');

    // assign container to the global namespace
    global.container = require('./libs/container');

    container.register('storage', storage);
    container.register('queue', queue);
    container.register('profile', require('./libs/client/profile'));
    container.register('debug', debug);
    container.register('env', env);

    var server = websockets(new http(false));
    server.start();
})();