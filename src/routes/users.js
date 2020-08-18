import express from "express";
import User from "../models/user.model";
import Order from "../models/order.model";
import middlewares from "../middlewares/middleware";

const userRouter = express.Router();

// Fetch all users
userRouter.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error " + err));
});

// Update specific user info
userRouter
  .route("/:userId")
  .all(middlewares.verifyRole)
  .patch((req, res) => {
    const id = req.params.userId;

    // Remember to allow admin change user role
    User.findById(id)
      .then((user) => {
        // Set user role to role from request body
        user.role = req.body.role;
        // Save new user role to database
        user
          .save()
          .then(() => res.json("User role changed to " + user.role))
          .catch((err) => res.status(400).json("Error " + err));
      })
      .catch((err) => res.status(400).json("Error " + err));
  });

module.exports = userRouter;
