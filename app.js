const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
dotenv.config();

const MONGO_ENDPOINT = `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@cluster0.smimobs.mongodb.net/shop`

const app = express();
const store = new MongoDBStore({
    uri: MONGO_ENDPOINT,
    collection: "sessions"
})
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { pageNotFound } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: store}))

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
    })
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(pageNotFound);

mongoose
  .connect(MONGO_ENDPOINT)
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
