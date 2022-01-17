function Cart() {
    this.totalPrice = 0;
    this.itemsInCart = 0;
    this.items = [];
}

Cart.prototype.addToCart = function(addedItem) {
    const itemInCart =  this.items.find(item => item.id === addedItem.id)
    this.totalPrice += addedItem.price;
    this.itemsInCart++;
    if(!itemInCart) {
        addedItem.quantity = 1;
        this.items.push(addedItem);
    } else {
        const itemInCart = this.items.find(item => item.id === addedItem.id)
        itemInCart.quantity++;
    }
    
}

Cart.prototype.decreaseItemQuantity = function(decreasedItem) {
    decreasedItem.quantity--;
    this.itemsInCart--;
    this.totalPrice -= decreasedItem.price;
}

Cart.prototype.removeFromCart = function(removedItem) {
    const itemInCart = this.items.find(item => item.id === removedItem.id);
    const itemIndex = this.items.indexOf(itemInCart);
    this.itemsInCart-=itemInCart.quantity;
    this.totalPrice-=(itemInCart.quantity*itemInCart.price);
    this.items.splice(itemIndex, 1)
}

Cart.prototype.getItem = function(id) {
    const item = this.items.find(item => item.id === id);
    return item;
}

Cart.prototype.isExist = function(id) {
    return this.getItem(id) ?
    true :
    false
}

export default Cart
