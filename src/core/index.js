"use strict";

var utils = require('../utils');
var viewport = require('agency-pkg-services/viewport');

var Core = function(el) {

    this.locked = false;
    this.timer = null;

    this.el = el;
    el.classList.add('agency-pkg-fullscreen-core');

    this.contentEl = el.querySelector('[data-hook="content"]');
    this.scrollPreventerEl = el.querySelector('[data-hook="scroll-preventer"]');
    this.htmlEl = document.body.parentElement;
    console.log(this);
    generateHelpers(this);

    this.defaultHeight = this.checkEl[utils.getSizePropertyNames(this.checkEl).height];

    var scope = this;
    if (utils.hasNativeFullscreen()) {
        this.htmlEl.classList.add('agency-pkg-fullscreen-native');
        this.fullScreenChangeEvents.forEach(function(name) {
            scope.contentEl.addEventListener(name, function() {
                scope.setLocked(utils.nativeFullscreenEnabled());
            });
        });
    } else {
        var cb = function() {
            var scrollTop = global[utils.getScrollPropertyNames(global).y];
            if (scope.timer) {
                global.clearTimeout(scope.timer);
            }
            global.animationFrame.add(function() {
                scope.scrollPreventerEl[utils.getScrollPropertyNames(scope.scrollPreventerEl).y] = parseInt(scope.spacerEl[utils.getSizePropertyNames(scope.spacerEl).height]) / 3;
            });
            scope.timer = setTimeout(function() {
                if (((scrollTop > 0 && scope.locked === false) || scope.locked === true) && global[utils.getSizePropertyNames(global).height] !== scope.defaultHeight) {
                    scope.setLocked(true);
                } else {
                    scope.setLocked(false);
                }
            }, 150);
        };
        viewport.callbacks.SCROLL.push(cb);
        viewport.callbacks.RESIZE.push(cb);
    }
};
Core.prototype.fullScreenChangeEvents = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'];
Core.prototype.onBeforeChange = function() {};
Core.prototype.onAfterChange = function() {};
Core.prototype.setLocked = function(locked) {
    if (this.locked !== locked) {
        onBeforeChange.bind(this)(locked);
        this.locked = locked;
        onAfterChange.bind(this)(locked);
    }
};

function generateHelpers(scope) {
    // Spacer
    var spacerEl = document.createElement('span');
    spacerEl.setAttribute('data-hook', 'spacer');
    scope.scrollPreventerEl.appendChild(spacerEl);
    scope.spacerEl = spacerEl;
    // Check
    var checkEl = document.createElement('span');
    checkEl.setAttribute('data-hook', 'check');
    scope.el.appendChild(checkEl);
    scope.checkEl = checkEl;
}

function onBeforeChange(locked) {
    if (typeof this.onBeforeChange === 'function') {
        this.onBeforeChange.bind(this)(locked);
    }
}

function onAfterChange(locked) {
    if (locked) {
        if (utils.hasNativeFullscreen()) {
            this.htmlEl.classList.add('agency-pkg-fullscreen-locked');
            if (utils.hasNativeFullscreen()) {
                utils.nativeFullscreen(this.contentEl, true);
            }
        } else {
            if (this.htmlEl.classList.contains('agency-pkg-fullscreen-locked')) {
                global.animationFrame.add(function() {
                    global[utils.getScrollPropertyNames(global).y] = 0;
                });
            } else {
                this.htmlEl.classList.add('agency-pkg-fullscreen-locked');
                global.animationFrame.add(function() {
                    global[utils.getScrollPropertyNames(global).y] = 0;
                    this.contentEl[utils.getScrollPropertyNames(this.contentEl).y] = 0;
                }.bind(this));
            }
        }
    } else {
        this.htmlEl.classList.remove('agency-pkg-fullscreen-locked');
    }

    if (typeof this.onAfterChange === 'function') {
        this.onAfterChange.bind(this)(locked);
    }
}

module.exports = Core;
