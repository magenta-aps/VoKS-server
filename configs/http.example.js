/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function(){
    var config = {};
    config.port = 9000;

    config.secure = {};
    config.secure.port = 9001;
    config.secure.enabled = false;
    config.secure.key = '/etc/apache2/ssl/apache.key';
    config.secure.certificate = '/etc/apache2/ssl/apache.crt';

    module.exports = config;
})();