import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../shared/db.js";
import employeeRoutes from "./routes/employees.routes.js";
import vacationRoutes from "./routes/vacations.routes.js";
import alertRoutes from "./routes/alerts.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGODB_URI;

connectDB(MONGO_URI);

app.get("/", (req, res) => res.send("HR system is running"));
app.use("/api/employees", employeeRoutes);
app.use("/api/vacations",vacationRoutes);
app.use("/api/alerts", alertRoutes);
app.listen(PORT, () => {
  console.log(`🚀 HR server running on port ${PORT}`);
});
