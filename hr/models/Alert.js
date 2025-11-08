import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    trim: true,
  },
  alert_type: {
    type: String,
    enum: ["Anniversary", "Vacation Exceeded", "Birthday", "Other"],
    required: true,
  },
  triggered_on: {
    type: Date,
    required: true,
  },
  details: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true, // lưu createdAt & updatedAt
});

const Alert = mongoose.model("Alert", AlertSchema);
export default Alert;
