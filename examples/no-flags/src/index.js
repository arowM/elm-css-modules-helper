var Elm = require('./Main').Elm;
require('./styles/reset.scss');
require('./styles/layout.scss');
require('./styles/input.scss');
require('./styles/label.scss');
require('./styles/app.scss');

var wrapper = document.createElement('div');
document.body.appendChild(wrapper);
var app = Elm.Main.init({
  node: wrapper,
  flags: null,
});
