var config = require('../config');
// Title, headings, and nav

exports.ifEnv =  function(conditional, options) {
    console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV == conditional) {
        return options.fn(this);
    }  else {
        return options.inverse(this);
    }
};


// -- Helpers ------------------------------------------------------------------
exports.setTitle = function setTitle(title) {
    this.title = title;
}


exports.checkedIfEqual = function checkedIfEqual (check, name){
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

exports.getAge = function(year){
    if(year){
        return new Date().getFullYear() - (+year)
    }
}