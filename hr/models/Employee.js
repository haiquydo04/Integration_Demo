import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  gender: String,
  ethnicity: String,
  department: String,
  employmentType: { type: String, enum: ["Full-Time", "Part-Time"] },
  hireDate: Date,
  position: String,
});

export default mongoose.model("Employee", employeeSchema);
