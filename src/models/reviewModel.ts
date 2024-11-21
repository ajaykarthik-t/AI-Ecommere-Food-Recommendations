const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// delete if review model already exists
if (mongoose.models && mongoose.models["reviews"])
  delete mongoose.models["reviews"];

export default mongoose.model("reviews", reviewSchema);
