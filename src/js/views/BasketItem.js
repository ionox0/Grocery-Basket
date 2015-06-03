'use-strict';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      inBasket: (!!this.props.inBasket) || false
    };
  },
  handleRemove: function(e) {
    e.preventDefault();
    this.props.onItemRemove(this.props.data);
  },
  toggleInBasket: function(e) {
    console.log('asdf');
    this.setState({ inBasket: !this.state.inBasket });
  },
  render: function() {
    return (
      <div className='basket-item'>
        <div className='user'>
          {this.props.data.user}
        </div>
        <div className='item'>
          {this.props.data.type}
        </div>
        <div className='quantity'>
          {this.props.data.quantity}
        </div>
        <div className='options'>
          <div className="squaredTwo">
            <input type="checkbox" className="in-basket"
              checked={this.state.inBasket}
              defaultChecked={this.state.inBasket}
              onChange={this.toggleInBasket} />
            <label htmlFor="squaredTwo"></label>
          </div>
          <button value='remove' onClick={this.handleRemove}>Remove</button>
        </div>
      </div>
    );
  }
});