import AlertMessage from './alert.js'

const alertMessage = new AlertMessage();
function Cart() {
    this.totalPrice = 0;
    this.itemsInCart = 0;
    this.items = [];
}

Cart.prototype.addToCart = function(addedItem) {
    const itemInCart =  this.items.find(item => item._id === addedItem._id)
    this.totalPrice += addedItem.price;
    this.itemsInCart++;
    if(!itemInCart) {
        addedItem.quantity = 1;
        this.items.push(addedItem);
        alertMessage.showAlert('Product added to your cart', 'success');
    } else {
        const itemInCart = this.items.find(item => item._id === addedItem._id)
        itemInCart.quantity++;
        alertMessage.showAlert('Number of product has been increased', 'update');
    }
    
}

Cart.prototype.decreaseItemQuantity = function(decreasedItem) {
    decreasedItem.quantity--;
    this.itemsInCart--;
    this.totalPrice -= decreasedItem.price;
    alertMessage.showAlert('Number of product has been decreased', 'warning');
}

Cart.prototype.removeFromCart = function(removedItem) {
    const itemInCart = this.items.find(item => item._id === removedItem._id);
    const itemIndex = this.items.indexOf(itemInCart);
    this.itemsInCart-=itemInCart.quantity;
    this.totalPrice-=(itemInCart.quantity*itemInCart.price);
    this.items.splice(itemIndex, 1)
    alertMessage.showAlert('Product removed from your cart', 'danger');
}

Cart.prototype.getItem = function(id) {
    const item = this.items.find(item => item._id === id);
    return item;
}

Cart.prototype.isExist = function(id) {
    return this.getItem(id) ?
    true :
    false
}

export default Cart
