const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  Product.fetchAll()
      .then(([rows]) => {
        res.render("shop/product-list", {
          prods: rows,
          pageTitle: "View Products",
          path: "/products-list",
          hasProducts: rows.length > 0,
        });
      })
      .catch(
          err => console.log(err)
      );
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product
      .findById(prodId)
      .then(([item]) => {
        res.render("shop/product-detail", {
          product: item[0],
          pageTitle: item[0].title,
          path: "/products"
        });
      })
      .catch(err => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.fetchAll()
      .then(([rows]) => {
        res.render("shop/index", {
          prods: rows,
          pageTitle: "Our Online Store",
          path: "/",
          hasProducts: rows.length > 0
        });
      })
      .catch(err => console.log(err));
};

exports.getCart = (req,res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts
      })
    });
  })
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart")
}

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
}

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res) => {
  Cart.fetchCart((cart) => {
    res.render("shop/orders", {
      cart,
      path: "/orders",
      pageTitle: "Orders",
    });
  });
};
