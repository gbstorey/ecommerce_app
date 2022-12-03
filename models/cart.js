const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const getCartFromFile = (cb) => {
    fs.readFile(p, (err, fileContnet) => {
        if (err) {
            return cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class CartItem {
    constructor(t, n) {
        this.title = t;
        this.number = n;
    }
    save() {
        getCartFromFile((cart) => {
            cart.push(this);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
    static fetchCart(cb) {
        getCartFromFile(cb)
    }
}