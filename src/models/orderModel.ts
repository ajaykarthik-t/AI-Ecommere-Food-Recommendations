import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    items: [],
    paymentStatus: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
if (mongoose.models && mongoose.models["orders"])
  delete mongoose.models["orders"];

export default mongoose.model("orders", orderSchema);
