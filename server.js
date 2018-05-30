/*-----------------------
        Variables
-----------------------*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Profile = require('./models/Profile');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const passport = require('passport');
const { Strategy, ExtractJwt } = require("passport-jwt");
const port = process.env.port || 5000;
const app = express();

/*-----------------------
       Middleware
-----------------------*/
// setup mongoose
mongoose
  .connect("mongodb://test:test@ds115360.mlab.com:15360/devconnector1-test")
  .then(() => console.log("mlab connected!"))
  .catch(err => console.log(err.message));

// setup passport
app.use(passport.initialize())
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret"
};
passport.use(new Strategy(options, (payload, done) => {
  User.findById(payload.id)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(err => console.log(err));
}));

// setup validator
const isEmptyObject = obj => typeof obj === "object" && Object.keys(obj).length === 0;

function validateRegister(data) {
  const errors = {};
  data.name = data.name || "";
  data.email = data.email || "";
  data.password = data.password || "";

  if (validator.isEmpty(data.name)) errors.name = "name field is required!";
  if (!validator.isEmail(data.email)) errors.email = "email is invalid!";
  if (validator.isEmpty(data.password)) errors.password = "password field is required!";
  return { errors, isValid: isEmptyObject(errors) };
}

function validateLogin(data) {
  const errors = {};
  data.email = data.email || "";
  data.password = data.password || "";
  if (!validator.isEmail(data.email)) errors.email = "email is invalid!";
  if (validator.isEmpty(data.password)) errors.password = "password field is required!";
  return { errors, isValid: isEmptyObject(errors) };
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("client/build"))

/*-----------------------
         Routes
-----------------------*/

// get all users
app.get("/api/users/", (req, res) => {
  User.find({})
    .then(users => res.json(users));
});

// register a new user
app.post("/api/users/register", (req, res) => {
  const { errors, isValid } = validateRegister(req.body);
  const { name, email, password } = req.body;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.email = "Email already exists!";
        return res.status(400).json(errors);
      }
      const avatar = gravatar.url(email, {s: '200', d: 'mm'});
      var newUser = new User({ name, email, avatar });
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(password, salt, (err2, hash) => {
          newUser.password = hash;
          newUser.save()
            .then(() => res.json({ success: true, msg: "successfully created user" }))
            .catch(error => res.status(400).json(error));
        });
      });
    });
});

// login a user
app.post("/api/users/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  const { email, password } = req.body;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        errors.email = "user not found";
        return res.status(400).json(errors);
      }
      const { name, avatar } = user;
      bcryptjs.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // if passwords match generate token and user data to send back
            const payload = { id: user.id, name, email, avatar };
            jwt.sign(payload, "secret", { expiresIn: 3000 }, (err, token) => {
              res.json({ success: true, token: `Bearer ${token}` });
            });
          }
          else {
            errors.password = "passwords don't match";
            return res.status(400).json(errors);
          }
        });
    });
});

// get current user profile [protected]
app.get("/api/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .populate({ path: "user", model: "users", select: ["name", "avatar"] })
    .then(profile => res.json(profile))
})

// create a user profile [protected]
app.post("/api/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { status, skills, location, github } = req.body;
  const profileFields = { status, skills, location, github };
  profileFields.user = req.user.id;

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate({ user: req.user.id }, profileFields, { new: true })
          .then((updatedProfile) => {
            res.json(updatedProfile);
          });
      }
      else {
        new Profile(profileFields).save()
          .then(item => res.json(item));
      }
    });
});

app.listen(port, () => console.log(`running on http://localhost:${port}`));
