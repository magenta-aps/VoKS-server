/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    var BaseModel = require('./device'),
        extend = require('../../utils/extend');

    function DesktopClient(id, shelterId, connection, invalidateCache) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;

        // true means invalidate (don't send CLIENT_CONNECTED) - first time/first open
        // false means check existing cache
        this.invalidateCache = invalidateCache;
    }

    extend(BaseModel, DesktopClient);

    module.exports = DesktopClient;
})();