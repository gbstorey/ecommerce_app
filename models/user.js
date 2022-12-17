const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  this.cart = {
    items: updatedCartItems,
  }

  return this.save()
    .then(() => {
      console.log("CART UPDATED");
    })
    .catch((err) => {
      console.log(err);
    });
};
userSchema.methods.removeFromCart = function (productId) {
  this.cart.items = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    return this.save()
      .then(() => {
        console.log("CART UPDATED");
      })
      .catch((err) => {
        console.log(err);
      });
}
userSchema.methods.clearCart = function() {
  this.cart.items = []
  return this.save()
}
userSchema.methods.getOrders = function() {
    return this.cart
  }

module.exports = mongoose.model("User", userSchema);
