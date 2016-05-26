/**
 * We utilize a number of express utilities in our app. These are attached as "middleware" and enhance
 * our servers capabilities.
 */

var config = require('../config');

// templating and response handling
var hbs = require('../lib/exphbs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// logging
var morgan = require('morgan');

// database and persistence
var pg = require('pg')
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var dbUtils = require('../lib/dbUtils');
var state = require('express-state');

var store = new pgSession({
    pg: pg,
    conString: config.postgres,
    tableName: 'session'
});

// messages to our views
var flash = require('express-flash');

// general utils
var utils = require('../lib/utils');

exports.initGlobalMiddleware = initGlobalMiddleware;

// authentication, security and roles
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var permission = require('permission');
var compression = require('compression');
// var csrf = require('csurf');


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


/**
 * Given an express app object this function will setup the app with middleware across all of
 * its routes
 * @param app   Express application
 */
function initGlobalMiddleware(app) {
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
        app.use(morgan('tiny'));
    }

    // Set default views directory.
    app.set('views', config.dirs.views);

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

    // Initialize Passport and restore authentication state, if any
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

    return app;
}