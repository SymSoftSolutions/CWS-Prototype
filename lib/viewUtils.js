var config = require('../config');
// Title, headings, and nav
exports.setTitle = setTitle;
exports.checkedIfEqual = checkedIfEqual;
exports.production = (process.env.NODE_ENV) ? true : false;



// -- Helpers ------------------------------------------------------------------
function setTitle(title) {
    this.title = title;
}


function checkedIfEqual (check, name){
    return (check === name) ? "checked": "";
}


exports.getAvatarPath =  function getAvatarPath(avatar){
    return '/' + config.dirs.pub + "/avatars/" + avatar
}

exports.adultBirthMonth = function(index){
        return "userDetails[adults]["+ index+ "][dob][month]"
}


exports.childBirthMonth = function(index){
    return "userDetails[children]["+ index+ "][dob][month]"
}