const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/products", {
      activeShop: true,
      productCSS: true,
      prods: products,
      pageTitle: "View Products",
      path: "/products",
      hasProducts: products.length > 0,
    });
  });
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      activeShop: true,
      productCSS: true,
      prods: products,
      pageTitle: "Our Online Store",
      path: "/",
      hasProducts: products.length > 0,
    });
  });
}

exports.getCart = (req,res) => {
  Cart.fetchCart((cart) => {
    res.render("shop/cart", {
      cart,
      pageTitle: "Your Cart",
      path: "/cart",
      hasCartItems: cart.length > 0
    })
  })
}

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
}

exports.getOrders = (req, res) => {
  Cart.fetchCart((cart) => {
    res.render("shop/orders", {
      cart,
      path: "/orders",
      pageTitle: "Orders"
    });
  });
}