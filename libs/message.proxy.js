/**
 * BComeSafe, http://bcomesafe.com
 * Copyright 2015 Magenta ApS, http://magenta.dk
 * Licensed under MPL 2.0, https://www.mozilla.org/MPL/2.0/
 * Developed in co-op with Baltic Amadeus, http://baltic-amadeus.lt
 */

(function () {
  function MessageProxy () {
    var connectionPool = require('./connection.pool'),
      queue = container.get('queue'),
      debug = container.get('debug'),
      profile = container.get('profile');

    return {
      forward: forward,
      bulkForward: bulkForward,
      getTriggered: getTriggered
    };

    /**
     * Finds profiles by client properties and sends
     * the messages or caches them on failure
     *
     * @param options
     * @param message
     * @param cache
     */
    function forward (options, message, cache) {
      var recipients = connectionPool.filter(options),
        index = 0;

      // if cache is enabled, check if client exists
      // and if not, cache the message
      if (true === cache && 'undefined' !== typeof options.id) {
        if (recipients.length === 0) {
          queue.add(options.id, message);
          debug.log('Caching1', JSON.stringify(message));
        }
      }

      for (index; index < recipients.length; index++) {
        var response = recipients[index].sendMessage(message);
        // it's possible the client was disconnected or
        // unreachable so this caches the message
        if (false === response) {
          queue.add(options.id, message);
          debug.log('Caching2', JSON.stringify(message));
        }
      }
    }

    /**
     * Returns all triggered clients
     *
     * @param options
     * @returns {Object}
     */
    function getTriggered (options) {
      var clients = connectionPool.filter(options),
        ids = {},
        index = 0;

      for (index; index < clients.length; index++) {
        ids[clients[index].id] = profile.get(clients[index].id);
      }

      return ids;
    }

    /**
     * Forward messages for a list of IDs
     *
     * @param ids
     * @param message
     * @param cache
     */
    function bulkForward (ids, message, cache) {
      var index = 0;

      for (index; index < ids.length; index++) {
        forward({id: ids[index]}, message, cache);
      }
    }
  }

  module.exports = new MessageProxy();
})();
