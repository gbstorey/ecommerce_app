
const express = require("express");
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart, postCartDeleteProduct } = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);
router.get("/product-list", getProducts);
router.get("/products/:productId", getProduct);
router.get("/cart", getCart)
router.post("/cart", postCart)
router.post("/cart-delete-item", postCartDeleteProduct);
router.get("/checkout", getCheckout);
router.get("/orders", getOrders);

module.exports = router;
