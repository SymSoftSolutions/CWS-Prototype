var jQuery = require('./libraries/jquery-2.2.4.js');
//test
var helpers = require('./js/helpers');

// bring them in for their global code
require('./libraries/jquery-accessibleMegaMenu');



// import our stylesheets
require('./framework/framework.scss');


// Init Our Accordion
require('./libraries/accordion');

if (jQuery) {
    (function ($) {
        'use strict';
        $(document).ready(function () {
            // initialize the megamenu
            $('.megamenu').accessibleMegaMenu();

            // hack so that the megamenu doesn't show flash of css animation after the page loads.
            setTimeout(function () {
                $('body').removeClass('init');
            }, 500);
        });
    }(jQuery));
}

// Create Our Mega Menu
jQuery("#primary-nav").accessibleMegaMenu({

    /* Button that toggles navigation at mobile
     * When this is visible then it is assumed to be in the mobile view */
    navToggle: '#nav-toggle',

    /* Id of navigation */
    navId: '#primary-nav',

    /* mobile breakpoint in pixels that determines when the menu goes to mobile */
    // mobileBreakpoint: '900',
    /* prefix for generated unique id attributes, which are required
     to indicate aria-owns, aria-controls and aria-labelledby */
    uuidPrefix: 'menu',

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


// Make sure our nav-toggle will open up our navigation
$('#nav-toggle').on('keydown', function (e) {

    var key = e.which;
    if(key == 13 || key == 40 || key == 32)  // the enter key code
    {      e.preventDefault();
        $('#nav-toggle').get(0).click();


    }
});



// Form AutoCompletes
require('./libraries/selectize/selectize.js');
require('./libraries/selectize/selectize.css');

$('#select-state').selectize({
    create: false
});



// Form Date Pickers
require('./libraries/pika/pikaday.scss');
require('./libraries/pika/theme.css')
var pikaday = require('./libraries/pika/pikaday.js');

$('.date-picker').each(function(){
    console.log(this);
    var picker = new pikaday({ field: this
    });
})


