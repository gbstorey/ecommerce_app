const User = require("../models/user");
exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: "/login",
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
};

exports.postLogin = (req, res) => {
    User.findById("639cf8c60089ddb68bbbff0c")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.session.save(err => {
                console.log(err);
                res.redirect("/");
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
}