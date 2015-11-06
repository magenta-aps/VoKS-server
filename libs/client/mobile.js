/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    var BaseModel = require('./device'),
        extend = require('../../utils/extend');

    function MobileClient(id, shelterId, connection) {
        this.id = id;
        this.shelterId = shelterId;
        this.connection = connection;
    }

    extend(BaseModel, MobileClient);

    module.exports = MobileClient;
})();