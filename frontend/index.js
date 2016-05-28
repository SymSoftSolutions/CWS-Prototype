var jQuery = require('./js/jquery-2.2.4.js');
//test
var helpers = require('./js/helpers');

// bring them in for their global code
require('./js/jquery-accessibleMegaMenu');
require('./js/megaMenuMain');


// import our stylesheets
require('./sass/app.css');
require('./sass/megamenu');
require('./sass/nav-styles');
require('./framework/framework.scss');

jQuery("#primary-nav").accessibleMegaMenu({

    /* Button that toggles navigation at mobile */
    navToggle: '#nav-toggle',

    /* Id of navigation */
    navId: '#primary-nav',

    /* mobile breakpoint in pixels that determines when the menu goes to mobile */
    mobileBreakpoint: '900',
    /* prefix for generated unique id attributes, which are required
     to indicate aria-owns, aria-controls and aria-labelledby */
    uuidPrefix: 'accessible-megamenu',

    /* css class used to define the megamenu styling */
    menuClass: 'nav-menu',

    /* css class for a top-level navigation item in the megamenu */
    topNavItemClass: 'nav-item',

    /* css class for a top-level icon in the megamenu (displayed at mobile) */
    topNavIconClass: '.icon',

    /* css class for a megamenu panel */
    panelClass: 'sub-nav',

    /* css class for a group of items within a megamenu panel */
    panelGroupClass: 'sub-nav-group',

    /* css class for the hover state */
    hoverClass: 'hover',

    /* css class for the focus state */
    focusClass: 'focus',

    /* css class for the open state */
    openClass: 'open'
});
