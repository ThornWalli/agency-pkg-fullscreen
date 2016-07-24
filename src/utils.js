'use strict';
var utils = function() {};
utils.prototype.getSizePropertyNames = function(el) {
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
};
utils.prototype.getScrollPropertyNames = function(el) {
    var properties = {};
    if ('pageXOffset' in el) {
        properties.x = 'pageXOffset';
        properties.y = 'pageYOffset';
    } else if ('scrollX' in el) {
        properties.x = 'scrollX';
        properties.y = 'scrollY';
    } else {
        properties.x = 'scrollLeft';
        properties.y = 'scrollTop';
    }
    return properties;
};
utils.prototype.hasNativeFullscreen = function() {
    return document.body.requestFullScreen ||
        document.body.mozRequestFullScreen ||
        document.body.webkitRequestFullScreen;
};
utils.prototype.nativeFullscreenEnabled = function() {
    return document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
};
utils.prototype.nativeFullscreen = function(el, fullscreen) {
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
};
module.exports = new utils();
