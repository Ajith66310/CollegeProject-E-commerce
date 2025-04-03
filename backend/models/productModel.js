import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  image: {type: Array, required: true},
  category: {type: String, required: true},
  quantity: {type: Array, required: true},
  bestseller: {type: Boolean, required: true},
  date: {type: Number, required: true},
  inStock: { type: Boolean, required: true, default: true },
  expiryDate: {type: Date, required: true},
  reviews: [
    {
      userId: {type: String, required: true},
      username: {type: String, required: true},
      review: {type: String, required: true},
      createdAt: {type: Date, default: Date.now},
    },
  ],
});
productSchema.pre("find", function (next) {
  this.find({ expiryDate: { $gt: new Date() } }); // Exclude expired products
  next();
});

productSchema.pre("findOne", function (next) {
  this.findOne({ expiryDate: { $gt: new Date() } }); // Exclude expired products in single retrievals
  next();
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
