import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user_id: { type: String, required: true },
    pickup_location: { type: String, required: true },
    destination: { type: String, required: true },
    recipient_name: { type: String, required: true },
    recipient_phone: { type: String, required: true },
    description: { type: String, required: true },
    present_location: { type: String, required: true },
    price: { type: Number, required: true },
    order_status: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
