'use-strict';

module.exports = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var user = React.findDOMNode(this.refs.user).value.trim().toUpperCase();
    var type = React.findDOMNode(this.refs.item).value.trim();
    var quantity = parseInt(React.findDOMNode(this.refs.quantity).value.trim());
    if (!type || !user || !quantity) { // NaN is a falsey value
      return;
    }
    this.props.onItemSubmit({user: user, type: type, quantity: quantity});
    React.findDOMNode(this.refs.user).value = '';
    React.findDOMNode(this.refs.item).value = '';
    React.findDOMNode(this.refs.quantity).value = '';
  },
  render: function() {
    return (
      <form className="item-form" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="user" />
        <input type="text" placeholder="Grocery item" ref="item" />
        <input type="text" placeholder="Quantity" ref="quantity" />
        <input type="submit" value="Add" />
      </form>
    );
  }
});