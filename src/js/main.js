'use-strict';

var Basket = require('./Basket-App');

React.render(
  <Basket url='basket.json' pollInterval={2000} />,
  document.getElementById('content')
);