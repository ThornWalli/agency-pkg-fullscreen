"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');

var viewport = require('agency-pkg-services/viewport');

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
    timer: null,
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.htmlEl = document.body.parentElement;
        this.contentEl = this.queryByHook('content');
        this.scrollPreventerEl = this.queryByHook('scroll-preventer');
        this.checkEl = this.queryByHook('check');
        this.spacerEl = this.queryByHook('spacer');

        this.model.on('change:locked', onChangeLocked.bind(this));

        var cb = function() {
            var scrollTop = $(window).scrollTop();
            if (this.timer) {
                global.clearTimeout(this.timer);
            }
            global.animationFrame.add(function() {
                $(this.scrollPreventerEl).scrollTop(($(this.spacerEl).height()) / 3);
            }.bind(this));
            this.timer = setTimeout(function() {
                if (((scrollTop > 0 && this.model.locked === false) || this.model.locked === true) && $(global).height() !== $(this.checkEl).height()) {
                    this.model.locked = true;
                } else {
                    this.model.locked = false;
                }
            }.bind(this), 50);
        }.bind(this);
        viewport.callbacks.SCROLL.push(cb);
        viewport.callbacks.RESIZE.push(cb);

    }

});

function onChangeLocked(model, locked) {
    if (locked) {
        if (this.htmlEl.classList.contains('agency-pkg-fullscreen-locked')) {
            $(this.scrollPreventerEl).scrollTop(0);
            global.animationFrame.add(function() {
                $(global).scrollTop(0);
                console.log($(this.scrollPreventerEl).height() / 2, $(this.scrollPreventerEl).scrollTop());
            });
        } else {
            this.htmlEl.classList.add('agency-pkg-fullscreen-locked');
            $(this.scrollPreventerEl).scrollTop(0);
            global.animationFrame.add(function() {
                $(global).scrollTop(0);
            });
        }
    } else {
        this.htmlEl.classList.remove('agency-pkg-fullscreen-locked');
    }
}
