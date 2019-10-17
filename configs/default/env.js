(function(){
    var env = {};
    env.debug = true;
    env.appDir = __dirname + '/../';
    env.pingInterval = 3000; // ping interval in ms
    env.backendUrl = "http://loc.bcomesafe.com";
    module.exports = env;
})();
