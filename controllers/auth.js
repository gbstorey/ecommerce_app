const crypto = require('crypto')

const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_SECRET)

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            return res.redirect("/");
          });
        }
        req.flash('error', 'Invalid email or password.');
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'E-mail is already in use.');
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/");
          const msg = {
            to: email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          }
          return sgMail.send(msg)
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message
  })
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
        .then(user => {
          if (!user) {
            req.flash('error', 'No account with that email was found.')
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(() => {
          res.redirect('/');
          const msg = {
            to: req.body.email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Password Reset',
            html: `
              <p>You requested a password reset.</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>            
            `
          }
          return sgMail.send(msg)
        })
        .catch(err => {
      console.log(err);
    })
  })
}

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0]
        } else {
          message = null;
        }
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        console.log(err);
      })
}

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(() => {
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      })

}
