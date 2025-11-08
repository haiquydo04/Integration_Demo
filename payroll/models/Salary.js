import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  base_salary: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  overtime_pay: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  net_pay: {
    type: Number,
    required: true,
  },
  pay_date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
