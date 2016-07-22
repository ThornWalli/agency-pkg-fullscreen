"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');


module.exports = Controller.extend({
    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {

        }
    }),
    events: {
        'click': onClick
    },
    timer: null,
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

    }

});


function onClick(e) {
    e.preventDefault();
    console.log(this.targetModel.locked);
    this.targetModel.locked = false;
}
