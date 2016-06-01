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


