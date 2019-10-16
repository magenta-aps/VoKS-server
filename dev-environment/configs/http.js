(function(){
    var config = {};
    config.port = 9000;

    config.secure = {};
    config.secure.port = 9001;
    config.secure.enabled = true;
    config.secure.key = './certs/bcomesafe.key';
    config.secure.certificate = './certs/bcomesafe.crt';

    module.exports = config;
})();
