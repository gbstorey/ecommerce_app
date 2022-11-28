const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render("add-product", {
    activeAddProducts: true,
    formsCSS: true,
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
}

exports.postAddProduct = (req, res) => {
  const product = new Product( req.body.title );
  product.save();
  res.redirect("/");
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop", {
      activeShop: true,
      productCSS: true,
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
    });
  });
}