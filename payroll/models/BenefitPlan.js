import mongoose from "mongoose";

const BenefitPlanSchema = new mongoose.Schema({
  plan_id: { type: String, required: true, unique: true }, // BP01, BP02...
  plan_name: { type: String, required: true },
  description: { type: String },
  monthly_employee_contribution: { type: Number, required: true },
  monthly_employer_contribution: { type: Number, required: true },
  coverage_details: { type: [String] }, // danh sách quyền lợi
  effective_from: { type: Date, required: true },
  effective_to: { type: Date, required: true }
}, { timestamps: true, collection: "benefit_plans" });

export default mongoose.model("BenefitPlan", BenefitPlanSchema);
