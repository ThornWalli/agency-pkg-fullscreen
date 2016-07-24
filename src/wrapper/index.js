"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');

var Core = require('../core');

module.exports = Controller.extend({
    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            locked: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            }
        }
    }),
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.core = new Core(this.el);
        this.core.onAfterChange = function(locked) {
            if (locked) {
                this.model.locked = locked;
            }
        }.bind(this);
        this.model.on('change:locked', function(model, locked) {
                this.core.setLocked(locked);
        }.bind(this));
    }

});
