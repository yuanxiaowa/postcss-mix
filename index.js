"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postcss = require("postcss");
var mixins = require("postcss-mixins");
var variables = require("postcss-advanced-variables");
var media = require("postcss-custom-media");
var customProperties = require("postcss-custom-properties");
var minmax = require("postcss-media-minmax");
var color = require("postcss-color-function");
var nesting = require("postcss-nesting");
var nested = require("postcss-nested");
var selectors = require("postcss-custom-selectors");
var atroot = require("postcss-atroot");
var lookup = require("postcss-property-lookup");
var extend = require("postcss-extend");
var matches = require("postcss-selector-matches");
var not = require("postcss-selector-not");
var short = require("postcss-short");
var functions = require("postcss-functions");
var calc = require("postcss-calc");
var autoprefixer = require("autoprefixer");
var pseudoelements = require("postcss-pseudoelements");
var colorRgbaFallback = require("postcss-color-rgba-fallback");
var opacity = require("postcss-opacity");
var cssnano = require("cssnano");
var processors = [
    ['mixins', mixins],
    ['variables', variables],
    ['media', media],
    ['customProperties', customProperties],
    ['minmax', minmax],
    ['color', color],
    ['nesting', nesting],
    ['nested', nested],
    ['selectors', selectors],
    ['atroot', atroot],
    ['lookup', lookup],
    ['extend', extend],
    ['matches', matches],
    ['not', not],
    ['short', short],
    ['functions', functions],
    ['calc', calc]
];
exports.default = postcss.plugin('postcss-mix', function (opts) {
    var proc = postcss();
    opts = Object.assign({
        autoprefixer: {
            browsers: ['last 2 versions']
        },
        compact: false,
        optimize: false
    }, opts);
    processors.forEach(function (item) {
        var key = item[0];
        var opt = opts[key];
        if (opt === false) {
            opt = {
                disable: true
            };
        }
        else if (!opt) {
            opt = {};
        }
        if (!opt.disable) {
            proc.use(item[1](opt));
        }
    });
    if (opts.compact) {
        proc
            .use(pseudoelements())
            .use(colorRgbaFallback({
            oldie: true
        }))
            .use(opacity());
    }
    if (opts.autoprefixer !== false) {
        proc.use(autoprefixer(opts.autoprefixer));
    }
    if (opts.optimize) {
        proc.use(cssnano({
            discardComments: {
                removeAll: true
            },
            autoprefixer: false
        }));
    }
    return proc;
});
