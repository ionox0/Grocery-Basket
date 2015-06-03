'use-strict';

var BasketItem = require('./BasketItem');

module.exports = React.createClass({
  render: function() {
    var that = this;
    var itemNodes = this.props.data.map(function(item, index) {
      return (
        <BasketItem data={item} key={index} onItemRemove={that.props.onItemRemove} />
      );
    });
    return (
      <div className="item-list">
        {itemNodes}
      </div>
    );
  }
});