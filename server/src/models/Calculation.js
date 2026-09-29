import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema({
  expression: {
    type: String,
    required: true,
    trim: true
  },
  result: {
    type: Number,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model("Calculation", calculationSchema);
