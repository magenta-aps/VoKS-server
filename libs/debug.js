/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function(){
    'use strict';
    function Debug (){
        require("console-stamp")(console, {
            pattern: "ddd mmm dd yyyy HH:MM:ss",
            metadata: function(){
                return ("[" + Math.round(process.memoryUsage().rss / 1024 / 1024, 2) + " Mb]");
            },
            colors: {
                stamp: "yellow",
                label: "white",
                metadata: "green"
            }
        });

        var colors = require('colors/safe'),
            config = require('../configs/env');

        return {
            log: log,
            warn: warn,
            error: error,
            separate: separate
        };

        /**
         *
         */
        function separate (){
            _colorMessage('green', ['----------------------------------']);
        }

        /**
         *
         */
        function log (){
            _colorMessage('green', arguments);
        }

        /**
         *
         */
        function warn (){
            _colorMessage('yellow', arguments);
        }

        /**
         *
         */
        function error (){
            _colorMessage('red', arguments);
        }

        /**
         *
         * @param color
         * @param messages
         * @private
         */
        function _colorMessage (color, messages){
            // don't log messages if debugging is turned off
            if (!config.debug) return;

            var index = 0;

            for (index; index < messages.length; index++) {
                console.log.call(console.log, colors[color](messages[index]));
            }
        }
    }

    module.exports = Debug();
})();