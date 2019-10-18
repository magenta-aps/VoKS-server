(function(){
    const environment = process.env.NODE_ENV || 'local';
    var config;
    try {
        config = require('./environments/' + environment);
    } catch (exception) {
        console.log("No environment config found for '" + environment + "'");
        console.log("Exiting");
        process.exit(1);
    }
    
    if (process.env.OVERRIDE_CERT_PATH || (config.secure.enabled && config.secure.key == "")) {
        console.log("Getting certificate path from env");
        config.secure.key = process.env.BCS_KEY_PATH;
        config.secure.certificate = process.env.BCS_CRT_PATH;
    }

    module.exports = config;
})();
