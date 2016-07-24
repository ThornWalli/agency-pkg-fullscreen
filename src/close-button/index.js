"use strict";

var Controller = require('agency-pkg-base/Controller');

module.exports = Controller.extend({
    events: {
        'click': onClick
    },
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
    }
});
function onClick(e) {
    e.preventDefault();
    this.targetModel.locked = false;
}
