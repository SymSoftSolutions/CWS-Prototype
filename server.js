var express = require('express');
var routes = require('./routes');
var config = require('./config');
var middleware = require('./middleware');

var app = express();
// var cluster = require('express-cluster');

//Uncomment the line below if you want to enable cluster support.
// require('./models/createAll').createAll().then(function(){
//     cluster(setupServer);
// })



/**
 * Initialization, attaching of routes and middleware and starting of server
 * @param worker
 * @returns {*}
 */
function setupServer(worker) {


    var router = express.Router({
        caseSensitive: app.get('case sensitive routing'),
        strict: app.get('strict routing')
    });


    // setup middle across all routes
    app = middleware.initGlobalMiddleware(app);

    // create a router covering all app's routes
    routes.createAllRoutes(router);

    // Use the router.
    app.use(router);

    // error handling for all routes
    routes.createErrorHandling(app);

    // start our server using our configured port
    server = app.listen(config.server.port, function () {
        console.log("App is now listening on port " + server.address().port);
    });

    return server;
}

exports.setupServer = setupServer;
exports.app = app;

if (require.main === module) {
        // will conditionally create our models if not already, then start our server
        require('./models/createAll').createAll().then(setupServer);
}
