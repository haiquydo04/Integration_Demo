import express from "express";
import {
  getTotalEarnings,
  getVacationSummary,
  getAverageBenefits,
  getEmployeeDetails,
  getAlerts,
  // getDashboardSummary
} from "../controllers/integrationController.js";

const router = express.Router();

// FR1 – Tổng thu nhập
router.get("/earnings", getTotalEarnings);

// FR2 – Ngày nghỉ phép
router.get("/vacations", getVacationSummary);

// FR3 – Phúc lợi trung bình
router.get("/benefits", getAverageBenefits);

// FR4 – Xem chi tiết nhân viên
router.get("/employees/details", getEmployeeDetails);

// // FR5 – Cảnh báo
router.get("/alerts", getAlerts);


export default router;
