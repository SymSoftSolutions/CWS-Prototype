// $('[action="updateprofile"]').on('submit', function(e){
//     e.preventDefault();
//     var formData = $(this).serialize();
//     console.log(formData);
// })

var toastr = require('toastr');

require('../libraries/jquery.cropit.js');


// profile modifications

$('.js-profile-add-adult').on('click touchstart', function(){
     $.ajax({
        'type':'GET',
        'url':'/add/adults',
        'cache':false
    }).then(function(data){
         $('.js-profile-adult-container').append(data);
        })
})

$('.js-profile-add-children').on('click touchstart', function(){
    $.ajax({
        'type':'GET',
        'url':'/add/children',
        'cache':false
    }).then(function(data){
        $('.js-profile-children-container').append(data);
    })
})

$('.profile-container').on('click', '.js-remove-adult, .js-remove-child', function(){
    console.log("removing")
    $(this).closest('fieldset').remove();
})

$(function () {
    $('[data-toggle="popover"]').popover()
})


// profile completion
function computeCompletion(){

    var total = 7;
    var found = 0;

    // at most +1
   if($('.js-children-pref input:checked').length){
       found += 1;
   }

    // at most +1
    found += $(".js-residence-about input:checked").length;

    // at most +4
    found += $('.js-residence-about input[type="text"]').filter(function () {
        return this.value.length > 0
    }).length;

    // at most +1
    if($('.js-profile-children-container').children().length){
        found += 1;
    }

    // at most +1
    if($('.js-profile-adult-container').children().length){
        found += 1;
    }


    var completness = (found / total * 100).toFixed(0);


    $('.js-profile-completeness').attr('aria-valuenow', completness).css("width", completness+ "%").text(completness + "%")
}


computeCompletion();



// Avatar
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
            window.setTimeout(function(){
                location.reload();
            },2000);

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

