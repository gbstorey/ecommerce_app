const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
    res.render("admin/add-product", {
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

exports.getAdminProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            activeShop: true,
            productCSS: true,
            prods: products,
            pageTitle: "Manage Products",
            path: "/admin/products",
            hasProducts: products.length > 0,
        });
    });
}