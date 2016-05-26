//setup Dependencies
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf = require('csurf'),
    session = require('express-session'),
    pg = require('pg'),
    pgSession = require('connect-pg-simple')(session),
    db = require('./lib/db'),
    state = require('express-state'),
    flash = require('express-flash'),
    cluster = require('express-cluster'),
    compression = require('compression'),
    hbs = require('./lib/exphbs'),
    routes = require('./routes'),
    middleware = require('./middleware'),
    config = require('./config'),
    utils = require('./lib/utils'),
    dbUtils = require('./lib/dbUtils'),
    port = (process.env.PORT || 8000);


// Setting up the connection to the postgres database
var db = require('./lib/db');

var store = new pgSession({
    pg: pg,
    conString: config.postgres,
    tableName: 'session'
});

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var permission = require('permission');


// Configure the local strategy for use by Passport.
// http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        return dbUtils.userCheck(username, password, cb);
    })
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
    cb(null, user.userID);
});

passport.deserializeUser(dbUtils.deserializeUser);

// will conditionally create our models if not already, then start our server
require('./models/createAll').createAll().then(setupServer);


//Uncomment the line below if you want to enable cluster support.
//cluster(setupServer);


function setupServer(worker) {
    var app = express(),
        server = app.listen(port, function () {
            console.log("App is now listening on port " + server.address().port);
        }),
        router;
// Specify the public directory.
    app.use(express.static(config.dirs.pub));
    //Setup Express App
    state.extend(app);
    app.engine(hbs.extname, hbs.engine);
    app.set('view engine', hbs.extname);
    app.enable('view cache');

    //Uncomment this if you want strict routing (ie: /foo will not resolve to /foo/)
    //app.enable('strict routing');

    //Change "App" to whatever your application's name is, or leave it like this.
    app.set('state namespace', 'App');

    //Create an empty Data object and expose it to the client. This
    //will be available on the client under App.Data.
    //This is just an example, so feel free to remove this.
    //app.expose({}, 'Data');

    if (app.get('env') === 'development') {
        app.use(middleware.logger('tiny'));
    }

    // Set default views directory. 
    app.set('views', config.dirs.views);

    router = express.Router({
        caseSensitive: app.get('case sensitive routing'),
        strict: app.get('strict routing')
    });

    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}))

    // Parse application/json
    app.use(bodyParser.json())

    // Parse cookies.
    app.use(cookieParser(config.strings.token));

    // Flash Message Support
    app.use(flash());

    //GZip Support
    app.use(compression());

    // Session Handling
    app.use(session({
        secret: config.strings.token,
        cookie: {
            httpOnly: true,
            maxAge: 10000 // ten seconds, for testing
        },
        secure: false,
        //store: store,
        resave: false,
        saveUninitialized: false
    }));

    // Initialize Passport and restore authentication state, if any, from the
// session.
    app.use(passport.initialize());
    app.use(passport.session());

    var notAuthenticated = {
        flashType: 'error',
        message: 'The entered credentials are incorrect',
        redirect: '/login'
    };

    var notAuthorized = {
        redirect: '/'
    };

    app.set('permission', {
        notAuthenticated: notAuthenticated,
        notAuthorized: notAuthorized
    });

    // app.use(csrf());
    // app.use(function (req, res, next) {
    //     var token = req.csrfToken();
    //     res.cookie('XSRF-TOKEN', token);
    //     res.locals._csrf = token;
    //     next();
    // });


    // Use the router.
    app.use(router);


    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////


    router.get('/',  routes.render('home'));

    router.get('/login', routes.render('login'));
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/profile', permission('fosterParent'), routes.render('profile'));

    router.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

    // testing session
    router.get('/session', function (req, res) {
        var n = req.session.views || 0
        req.session.views = ++n
        res.end(n + ' views')
    });


    // Error handling middleware
    app.use(function (req, res, next) {
        res.render('404', {status: 404, url: req.url});
    });

    app.use(function (err, req, res, next) {
        res.render('500', {
            status: err.status || 500,
            error: err,
            stack: err.stack
        });
    });

    return server;
}

