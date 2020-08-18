import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { confirmEmail } from "../helpers/mails";

const authRouter = express.Router();
const saltRounds = 10;

//  Register new user
authRouter.route("/signup").post((req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  // Encrypt the password using bcrypt package
  const password = bcrypt.hashSync(req.body.password, saltRounds);

  /* Note to self */
  // Remember to check if user exists with the same email
  // To prevent duplicate entry

  const newUser = new User({
    firstname,
    lastname,
    email,
    password,
  });

  newUser
    .save()
    .then(() => {
      // Send mail to user to confirm registration.
      confirmEmail(email, firstname);
      res.json("New User created ");
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// Allow user to sign In
authRouter.route("/login").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Check if user detail exists in database
  User.findOne({ email: email })
    .then((user) => {
      // Compare returned password with the post data
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          // Create a new jsonwebtoken on user login
          jwt.sign(
            { user_id: user.id, firstname: user.firstname, email: user.email },
            "jwt_secretkey",
            { expiresIn: "7d" },
            (err, token) => {
              res.json({
                user_id: user.id,
                email: user.email,
                token,
                role: user.role,
              });
            }
          );
        })
        .catch((err) => res.status(400).json("Password Incorrect"));
    })
    .catch((err) => res.status(400).json("Incorrect email"));
});

module.exports = authRouter;
