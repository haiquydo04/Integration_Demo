import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../shared/db.js";
import salaryRoutes from "./routes/salaries.routes.js";
import benefitRoutes from "./routes/benefits.routes.js";
import benefitPlansRoutes from "./routes/benefitPlans.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGODB_URI;

connectDB(MONGO_URI);

app.get("/", (req, res) => res.send("Payroll system is running"));
app.use("/api/salaries", salaryRoutes);
app.use("/api/benefits", benefitRoutes);
app.use("/api/benefit-plans", benefitPlansRoutes);
app.use("/api/alerts", alertsRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Payroll server running on port ${PORT}`);
});
