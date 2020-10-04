import express from "express";
import Order from "../models/order.model";
import jwt from "jsonwebtoken";
import middlewares from "../middlewares/middleware";

import { deliveryEmail } from "../helpers/mails";

const orderRouter = express.Router();

// Fetch all orders from database
orderRouter.route("/").get((req, res) => {
  Order.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Fetch a specific parcel order
orderRouter.route("/:parcelId").get((req, res) => {
  const id = req.params.parcelId;
  Order.findById(id)
    .then((order) => res.json(order))
    .catch((err) => res.status(400).json("Error " + err));
});

// Create a new Order
orderRouter.route("/").post((req, res) => {
  const userId = req.body.userId;
  const pickupLocation = req.body.pickupLocation;
  const destination = req.body.destination;
  const recipient_name = req.body.recipient_name;
  const recipient_phone = req.body.recipient_phone;
  const description = req.body.description;
  const price = Number(req.body.price);

  let phoneRegex = "(\\+)\\d+([0-9])";
  if (!recipient_phone.match(phoneRegex)) {
    res.json("Phone number should be of +xxxxxxxxxx format");
  }

  const newOrder = new Order({
    user_id: userId,
    pickup_location: pickupLocation,
    destination,
    recipient_name,
    recipient_phone,
    description,
    present_location: pickupLocation,
    price,
    order_status: 1,
  });

  newOrder
    .save()
    .then(() => res.json("New Order Created..."))
    .catch((err) => res.status(400).json("Error " + err));
});

// Edit existing Order
orderRouter.route("/:parcelId/destination").patch((req, res) => {
  const id = req.params.parcelId;
  Order.findById(id)
    .then((order) => {
      order.destination = req.body.destination;
      order.price = req.body.price;

      order
        .save()
        .then(() =>
          res.json("Order destination changed to " + order.destination)
        )
        .catch((err) => res.status(400).json("Error " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// Cancel order and change order status to cancelled.
orderRouter.route("/:parcelId/cancel").patch((req, res) => {
  const id = req.params.parcelId;
  Order.findById(id)
    .then((order) => {
      // Check if order status is not equal to "delivered" or "canceled"
      // Because delivered orders cannot be canceled
      if (order.order_status !== 2 || order.order_status !== 0) {
        order.order_status = 0;
      }

      order
        .save()
        .then(() => res.json("Order canceled..."))
        .catch((err) => res.status(400).json("Error " + err));
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// Change Order delivery status (Route should be accessible to admin only)
orderRouter
  .route("/:parcelId/status")
  .all(middlewares.verifyToken, middlewares.verifyRole)
  .patch((req, res) => {
    const id = req.params.parcelId;

    Order.findById(id)
      .then((order) => {
        order.order_status = req.body.orderStatus;

        order
          .save()
          .then(() => {
            // Verify if token saved in request matches token generated on login
            jwt.verify(req.token, "jwt_secretkey", (err, authData) => {
              if (err) {
                res.sendStatus(403);
              } else {
                // Send mail to user
                deliveryEmail(order.email, id);

                res.json({
                  status: 200,
                  message: "Order status changed to " + order.order_status,
                });
              }
            });
          })
          .catch((err) => res.status(400).json("Error " + err));
      })
      .catch((err) => res.status(400).json("Error " + err));
  });

// Update present location of existing Order (Route should only be accessible by admin)
orderRouter
  .route("/:parcelId/presentLocation")
  .all(middlewares.verifyToken, middlewares.verifyRole)
  .patch((req, res) => {
    const id = req.params.parcelId;
    Order.findById(id)
      .then((order) => {
        order.present_location = req.body.presentLocation;

        order
          .save()
          .then(() => {
            // Verify if token saved in request matches token generated on login
            jwt.verify(req.token, "jwt_secretkey", (err, authData) => {
              if (err) {
                res.sendStatus(403);
              } else {
                res.json({
                  message:
                    "Order destination changed to " + order.present_location,
                  authData,
                });
              }
            });
          })
          .catch((err) => res.status(400).json("Error " + err));
      })
      .catch((err) => res.status(400).json("Error " + err));
  });

// Fetch all parcel delivery orders by a specific user
orderRouter.route("/:userId/parcels").get((req, res) => {
  const userId = req.params.userId;

  Order.find({ user_id: userId })
    .then((parcels) => res.json(parcels))
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = orderRouter;
