/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function() {
    function propertyFilter(properties) {
        var self = this,
            matched = [],
            index = 0;

        for (index; index < self.length; index++) {
            var found = 0;
            for (var key in properties) {
                if (self[ index ][ key ] === properties[ key ]) {
                    found++;
                }
            }

            if (found === Object.keys(properties).length) {
                matched.push(self[ index ]);
            }
        }

        return matched;
    }
})();