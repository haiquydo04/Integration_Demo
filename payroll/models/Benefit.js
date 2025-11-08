import mongoose from "mongoose";

const BenefitSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  benefit_plan_id: {
    type: String,
    required: true,
  },
  plan_name: {
    type: String,
    required: true,
    trim: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  monthly_contribution: {
    type: Number,
    required: true,
  },
  employer_contribution: {
    type: Number,
    required: true,
  },
  last_modified: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Benefit = mongoose.model("Benefit", BenefitSchema);
export default Benefit;
