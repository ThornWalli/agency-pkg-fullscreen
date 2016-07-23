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
    events: {
        // 'click .clue': onClickClue
    },
    timer: null,
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);




        this.htmlEl = document.body.parentElement;
        this.contentEl = this.queryByHook('content');
        this.scrollPreventerEl = this.queryByHook('scroll-preventer');
        this.checkEl = this.queryByHook('check');
        this.spacerEl = this.queryByHook('spacer');

        this.defaultHeight = this.checkEl[getSizePropertyNames(this.checkEl).height];

        this.model.on('change:locked', onChangeLocked.bind(this));

        var cb;
        if (hasNativeFullscreen()) {
            this.htmlEl.classList.add('agency-pkg-fullscreen-native');
            cb = function() {
                this.model.locked = nativeFullscreenEnabled();
            };
            ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'].forEach(function(name) {
                this.contentEl.addEventListener(name, cb.bind(this));
            }.bind(this));

        } else {
            cb = function() {
                var scrollTop = global[getScrollPropertyNames(global).y];
                console.log('getScrollPropertyNames(global).y', getScrollPropertyNames(global).y);
                if (this.timer) {
                    global.clearTimeout(this.timer);
                }
                global.animationFrame.add(function() {
                    this.scrollPreventerEl[getScrollPropertyNames(this.scrollPreventerEl).y] = parseInt(this.spacerEl[getSizePropertyNames(this.spacerEl).height]) / 3;
                }.bind(this));
                this.timer = setTimeout(function() {
                    console.log(scrollTop,global[getSizePropertyNames(global).height], this.checkEl[getSizePropertyNames(this.checkEl).height]);
                    if (((scrollTop > 0 && this.model.locked === false) || this.model.locked === true) && global[getSizePropertyNames(global).height] !== this.defaultHeight) {
                        this.model.locked = true;
                    } else {
                        this.model.locked = false;
                    }
                }.bind(this), 50);
            }.bind(this);
            viewport.callbacks.SCROLL.push(cb);
            viewport.callbacks.RESIZE.push(cb);
        }


    }

});

function onChangeLocked(model, locked) {
    if (locked) {
        if (hasNativeFullscreen()) {
            this.htmlEl.classList.add('agency-pkg-fullscreen-locked');
            if (hasNativeFullscreen()) {
                nativeFullscreen(this.contentEl, true);
            }
        } else {
            if (this.htmlEl.classList.contains('agency-pkg-fullscreen-locked')) {
                global.animationFrame.add(function() {
                    global[getScrollPropertyNames(global).y] = 0;
                });
            } else {
                this.htmlEl.classList.add('agency-pkg-fullscreen-locked');
                global.animationFrame.add(function() {
                    global[getScrollPropertyNames(global).y] = 0;
                    this.contentEl[getScrollPropertyNames(this.contentEl).y] = 0;
                }.bind(this));
            }
        }
    } else {
        this.htmlEl.classList.remove('agency-pkg-fullscreen-locked');
    }
}


function hasNativeFullscreen() {
    return document.body.requestFullScreen ||
        document.body.mozRequestFullScreen ||
        document.body.webkitRequestFullScreen;
}

function nativeFullscreenEnabled() {
    return document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
}

function nativeFullscreen(el, fullscreen) {
    if (el.requestFullScreen) {
        if (fullscreen) {
            el.requestFullscreen();
        } else {
            document.exitFullScreen();
        }
    } else if (el.mozRequestFullScreen) {
        if (fullscreen) {
            el.mozRequestFullScreen();
        } else {
            document.mozCancelFullScreen();
        }
    } else if (el.webkitRequestFullScreen) {
        if (fullscreen) {
            el.webkitRequestFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
}

function getSizePropertyNames(el) {
    var properties = {};
    if ('innerWidth' in el) {
        properties.width = 'innerWidth';
        properties.height = 'innerHeight';
    } else if ('offsetWidth' in el) {
        properties.width = 'offsetWidth';
        properties.height = 'offsetHeight';
    } else {
        properties.width = 'clientWidth';
        properties.height = 'clientHeight';
    }
    return properties;
}

function getScrollPropertyNames(el) {
    var properties = {};
     if ('pageXOffset' in el) {
        properties.x = 'pageXOffset';
        properties.y = 'pageYOffset';
    } else if ('scrollX' in el) {
        properties.x = 'scrollX';
        properties.y = 'scrollY';
    } else{
        properties.x = 'scrollLeft';
        properties.y = 'scrollTop';
    }
    return properties;
}
