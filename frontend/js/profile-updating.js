var toastr = require('toastr');

require('../libraries/jquery.cropit.js');


// profile modifications

$('.js-profile-add-adult').on('click', function () {
    $.ajax({
        'type': 'GET',
        'url': '/add/adults',
        'cache': false
    }).then(function (data) {
        $('.js-profile-adult-container').append(data);
    })
})

$('.js-profile-add-children').on('click', function () {
    $.ajax({
        'type': 'GET',
        'url': '/add/children',
        'cache': false
    }).then(function (data) {
        $('.js-profile-children-container').append(data);
    })
})

$('.profile-container').on('click', '.js-remove-adult, .js-remove-child', function () {
    console.log("removing")
    $(this).closest('.js-option-existing').remove();
})

$(function () {
    $('[data-toggle="popover"]').popover()
})


// profile completion
function computeCompletion() {

    var total = 6;
    var found = 0;

    // at most +1
    if ($('.js-children-pref input:checked').length) {
        found += 1;
    }

    if ($('.js-residence-about  input[type="text"]:checked').length) {
        found += 1;
    }

    // at most +4
    found += $('.js-residence-about input[type="text"]').filter(function () {
        return this.value.length > 0
    }).length;

    // at most +1
    if ($('.js-profile-children-container .js-option-existing').children().length) {
        found += 1;
    }

    // at most +1
    if ($('.js-profile-adult-container .js-option-existing').children().length) {
        found += 1;
    }


    var completness = Math.min((found / total * 100).toFixed(0), 100);


    $('.js-profile-completeness').attr('aria-valuenow', completness).css("width", completness + "%").text(completness + "%")
}


computeCompletion();


// Avatar
$(function () {
    var $imageCropper = $('.image-editor').cropit({
        smallImage: 'stretch',
        maxZoom: 2,
        imageState: {
            // src: 'http://lorempixel.com/500/400/',
        },
        onImageError: function () {
            toastr.error("Please use an image that's at least " + $(".cropit-image-preview").outerWidth() + "px in width and " + $(".cropit-image-preview").outerHeight() + "px in height."), $(".cropit-image-preview")
            $(".cropit-image-preview").removeClass("has-error")
        }
    });

    $('.js-avatar-update').on('click touchstart', function () {

        $("#avataredit .modal-footer button").addClass("hidden");
        $("#avataredit #avatar_loading_msg").fadeIn();

        // have to use formData inorder for multi-part to work
        var data = new FormData();

        if ($imageCropper.cropit('imageSrc').trim() == '') {
            toastr.error('Choose Image first')
            return;
        }
        data.append('avatar', $('.image-editor').cropit('export'));
        var update = $.ajax({
            'type': 'POST',
            contentType: false,
            processData: false,
            data: data,
            'url': '/avatar',
            'cache': false,
        })

        update.then(function () {
            // Display a success toast, with a title
            toastr.info('Avatar Updated')
            window.setTimeout(function () {
                location.reload();
            }, 2000);
        })
    });

    $('.js-avatar-delete').on('click', function(){
        $("#avataredit .modal-footer button").addClass("hidden");
        $("#avataredit #avatar_loading_msg").fadeIn();

        var deletePromise = $.ajax({
            'type': 'DELETE',
            'url': '/avatar',
            'cache': false
        })

        deletePromise.then(function () {
            // Display a success toast, with a title
            toastr.info('Avatar Deleted');
            window.setTimeout(function(){
                location.reload();
            },1000);
        })
    });
});


$('#updateprofile').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            'type': 'POST',
            'url': 'ajaxupdate',
            data: $(this).serialize(),
            'cache': false
        }).then(function (data) {
            toastr.success("Profile Updated");
        })
});


$('.profile-container').on('click', '.js-profile-editing-cancel', function(e){
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.profile-editing-info').remove();
});

$('#avataredit').on('show.bs.modal', function (event) {
    $("#avataredit .modal-footer button").removeClass("hidden");
    $("#avataredit #avatar_loading_msg").hide();
});
