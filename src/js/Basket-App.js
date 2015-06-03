'use-strict';

var BasketItem = require('./views/BasketItem');
var BasketList = require('./views/BasketList');
var ItemForm = require('./views/ItemForm');

module.exports = React.createClass({
  loadItemsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleItemSubmit: function(item) {
    var items = this.state.data;
    items.push(item);
    this.setState({data: items}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: item,
        success: function(data){
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  handleItemRemove: function(item){
    var items = this.state.data;
    var elementPos = items.map(function(item) { 
      return item.id; 
    }).indexOf(item.id);
    items.splice(elementPos, 1);
    this.setState({data: items}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'DELETE',
        data: item,
        success: function(data){
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function(){
    return {data: []};
  },
  componentDidMount: function(){
    this.loadItemsFromServer();
    //setInterval(this.loadItemsFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className='basket-app'>
        <h1>Grocery Basket</h1>
        <BasketList data={this.state.data} onItemRemove={this.handleItemRemove} />
        <ItemForm onItemSubmit={this.handleItemSubmit} />
      </div>
    );
  }
});
