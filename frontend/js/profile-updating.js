// $('[action="updateprofile"]').on('submit', function(e){
//     e.preventDefault();
//     var formData = $(this).serialize();
//     console.log(formData);
// })

var toastr = require('toastr');

require('../libraries/jquery.cropit.js');

$(function() {
    var $imageCropper = $('.image-editor').cropit({
        smallImage: 'stretch',
        maxZoom: 2,
        imageState: {
            // src: 'http://lorempixel.com/500/400/',
        },
        onImageError: function() {
            toastr.error("Please use an image that's at least " + $(".cropit-image-preview").outerWidth() + "px in width and " + $(".cropit-image-preview").outerHeight() + "px in height."), $(".cropit-image-preview")
            $(".cropit-image-preview").removeClass("has-error")

        }
    });

    $('.js-avatar-update').on('click touchstart', function(){

        // have to use formData inorder for multi-part to work
        var data = new FormData();

        if($imageCropper.cropit('imageSrc').trim() == ''){
            toastr.error('Choose Image first')
            return;
        }
        data.append('avatar', $('.image-editor').cropit('export'));
        var update = $.ajax({
            'type':'POST',
            contentType : false,
            processData : false,
            data: data,
            'url':'/avatar',
            'cache':false,
        })
        
        update.then(function() {
            // Display a success toast, with a title
            toastr.info('Avatar Updated')
        })
    });

    $('.js-avatar-delete').on('click touchstart', function(){
        var deletePromise = $.ajax({
            'type':'DELETE',
            'url':'/avatar',
            'cache':false
        })

        deletePromise.then(function() {
            // Display a success toast, with a title
            toastr.info('Avatar Deleted')
            modalHide.trigger('click');
        })
    });
});

// Cache selectors
var html = $('html'),
    demo = $('.demo'),
    modal = $('.modal'),
    modalShow = $('.js-avatar-editor-show'),
    modalHide = $('.modal-hide'),
    modalWrapper = $('.modal-wrapper');

// Modal Show
modalShow.on('click touchstart', function(e) {
    e.preventDefault();
    html.addClass('no-scroll');
    modal.addClass('is-visible');
    demo.attr('aria-hidden', 'true');
    modal.attr({
        'aria-hidden': 'false',
        'open': 'true',
        'tabindex': '0'
    });
});

// Modal Hide
modalHide.on('click touchstart', function(e) {
    e.preventDefault();
    html.removeClass('no-scroll');
    modal.removeClass('is-visible');
    demo.attr('aria-hidden', 'false');
    modal.attr('aria-hidden', 'true');
    modal.removeAttr('open tabindex');
});

// Prevent toggle event from bubbling
modalWrapper.on('click touchstart', function(e) {
    e.stopPropagation();
});