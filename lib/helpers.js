// Title, headings, and nav
exports.setTitle = setTitle;
exports.production = (process.env.NODE_ENV) ? true : false;

// -- Helpers ------------------------------------------------------------------
function setTitle(title) {
    this.title = title;
}


