const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { pageNotFound } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("639cf8c60089ddb68bbbff0c")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

mongoose
  .connect(
    "mongodb+srv://admin:d43JupODgMB0DChu@cluster0.smimobs.mongodb.net/shop"
  )
  .then(() => {
      User.findOne().then(user => {
          if (!user) {
              const user = new User({
                  name: "Max",
                  email: "max@test.com",
                  cart: {
                      items: [],
                  },
              });
              user
                  .save()
                  .then(() => {
                      console.log("New User Created")
                  })
                  .catch(err => {
                      console.log(err);
                  });
          }
      })
    console.log("Database connection established, listening on port 3000");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
