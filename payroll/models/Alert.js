import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  employee_id: { type: String, required: true },
  alert_type: { type: String, required: true }, // Benefit Change, Payroll Adjustment...
  triggered_on: { type: Date, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Alert", AlertSchema);
