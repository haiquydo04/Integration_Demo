import mongoose from "mongoose";

// Schema con cho từng kỳ nghỉ trong mảng vacation_details
const VacationDetailSchema = new mongoose.Schema(
  {
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    approved_by: {
      type: String,
      trim: true, // Mã người quản lý duyệt nghỉ (M001, M002, ...)
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { _id: false } // không cần _id riêng cho từng phần tử
);

// Schema chính cho Vacation
const VacationSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    total_vacation_days: {
      type: Number,
      required: true,
      default: 0,
    },
    vacation_days_taken: {
      type: Number,
      required: true,
      default: 0,
    },
    vacation_details: {
      type: [VacationDetailSchema], // Mảng chi tiết kỳ nghỉ
      default: [],
    },
  },
  {
    timestamps: true, // thêm createdAt, updatedAt
    collection: "vacations", // tên collection trong MongoDB
  }
);

export default mongoose.model("Vacation", VacationSchema);
