var Elm = require('./Main').Elm;
require('./styles/reset.scss');

/* By setting `modules` option of `css-loader`,
  requiring style sheets returns JSON object that tells how original class names are transformes.

  ```json
  { "wrap": "layout__wrap--22P2G",
    "pack": "layout__pack--2OmbP",
    ...
  }
  ```
*/
var layout = require('./styles/layout.scss');
var input = require('./styles/input.scss');
var label = require('./styles/label.scss');
var app = require('./styles/app.scss');

var wrapper = document.createElement('div');
document.body.appendChild(wrapper);
var app = Elm.Main.init({
  node: wrapper,
  // Pass CSS class name JSON object to Elm via flags.
  flags: {
    layout: layout,
    input: input,
    label: label,
    app: app,
  },
});
