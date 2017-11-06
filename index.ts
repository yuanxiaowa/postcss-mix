import * as postcss from 'postcss'
import * as mixins from 'postcss-mixins'
import * as variables from 'postcss-advanced-variables'
import * as media from 'postcss-custom-media'
import * as customProperties from 'postcss-custom-properties'
import * as minmax from 'postcss-media-minmax'
import * as color from 'postcss-color-function'
import * as nesting from 'postcss-nesting'
import * as nested from 'postcss-nested'
import * as selectors from 'postcss-custom-selectors'
import * as atroot from 'postcss-atroot'
import * as lookup from 'postcss-property-lookup'
import * as extend from 'postcss-extend'
import * as matches from 'postcss-selector-matches'
import * as not from 'postcss-selector-not'
import * as short from 'postcss-short'
import * as functions from 'postcss-functions'
import * as calc from 'postcss-calc'
import * as autoprefixer from 'autoprefixer'
import * as pseudoelements from 'postcss-pseudoelements'
import * as colorRgbaFallback from 'postcss-color-rgba-fallback'
import * as opacity from 'postcss-opacity'
import * as cssnano from 'cssnano'

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
]

interface Option {
  autoprefixer?: any
  compact?: Boolean
  optimize?: Boolean
  [key: string]: any
}

export default postcss.plugin('postcss-mix', (opts: Option) => {
  var proc = postcss();
  opts = Object.assign({
    autoprefixer: {
      browsers: ['last 2 versions']
    },
    compact: false,
    optimize: false
  }, opts);
  processors.forEach(item => {
    var key = item[0];
    var opt = opts[key];
    if (opt === false) {
      opt = {
        disable: true
      };
    } else if (!opt) {
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
    }))
  }
  return proc;
})