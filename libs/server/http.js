/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */
(function(){
    function httpServer (){
        var fs = require('fs'),
            env = require('../../configs/env'),
            debug = require('../../libs/debug'),
            httpConfig = require('../../configs/http'),
            httpServer;

        function _listener (request, response){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(fs.readFileSync(env.appDir + 'views/index.html'));
            response.end();
        }

        debug.separate();
        if (httpConfig.secure.enabled) {
            var options = {
                key: fs.readFileSync(httpConfig.secure.key),
                cert: fs.readFileSync(httpConfig.secure.certificate)
            };

            httpServer = require('https').createServer(options, _listener);
            debug.warn('Started HTTPS server');
        } else {
            httpServer = require('http').createServer(_listener);
            debug.warn('Started HTTP server');
        }

        return {
            server: httpServer,
            listen: function() {
                httpServer.listen(
                    httpConfig.secure.enabled
                        ? httpConfig.secure.port
                        : httpConfig.port
                );
            }
        }
    }

    module.exports = httpServer;
})();