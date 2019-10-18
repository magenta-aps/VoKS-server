(function(){
    var env = {};
    env.debug = true;
    env.appDir = __dirname + '/../';
    env.pingInterval = 3000; // ping interval in ms
    env.backendUrl = process.env.BCS_BACKEND_URL || "http://loc.bcomesafe.com";
    module.exports = env;
})();
