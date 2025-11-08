import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import integrationRoutes from "./routes/integrationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/integration", integrationRoutes);

const PORT = process.env.PORT_INTEGRATION || 5003;
app.listen(PORT, () => console.log(`🚀 Integration server running on port ${PORT}`));
