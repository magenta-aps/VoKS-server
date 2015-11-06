/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function(){
    var env = {};
    env.debug = true;
    env.appDir = __dirname + '/../';
    env.pingInterval = 3000; // ping interval in ms
    env.cacheTtl = 1800;

    module.exports = env;
})();