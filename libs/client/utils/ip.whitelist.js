/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
    /**
     * IP Whitelist methods
     *
     * @returns {{check: Function}}
     */
    function ipWhitelist() {
        var storage = container.get('storage'),
            env = container.get('env'),
            http = require('http');

        /**
         * Checks an ip address against a stored
         * list of schoolIDs and IP addresses
         *
         * @param id
         * @param ipAddress
         * @returns {boolean}
         */
        function check(id, ipAddress) {
            var whitelist = storage.get('ip.whitelist');

            // if the schoolId doesn't exist deny access
            if ('undefined' === typeof whitelist[id]) {
                return false;
            }

            // if the ipAddress isn't mapped to that school
            // deny access
            if (formatIpAddress(ipAddress) !== whitelist[id].ip_address) {
                return false;
            }

            return true;
        }

        /**
         * Remove IPv6 prefix
         *
         * @param ipAddress
         * @returns {*}
         */
        function formatIpAddress(ipAddress) {
            return ipAddress.replace('::ffff:', '');
        }

        /**
         * Updates the whitelist
         *
         * @param list
         */
        function update(list) {
            storage.set('ip.whitelist', list);
        }

        /**
         * Send an HTTP request to System API
         * to receive the IP Whitelist
         */
        function fetchUpdate(callback) {
            http.get(env.backendUrl + '/api/system/ip-whitelist/list', function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    var whitelist = JSON.parse(body);
                    update(whitelist);
                    if ('function' === typeof callback) {
                        callback()
                    }
                });
            }).on('error', function (e) {
                console.log("Got an error pulling IP List: ", e);
            });
        }

        return {
            check: check,
            update: update,
            fetchUpdate: fetchUpdate
        }
    }

    module.exports = ipWhitelist();
})();
