import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

// 🔹 Lấy tất cả alert
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Lấy alert theo ID
router.get("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Tạo mới alert
router.post("/", async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Cập nhật alert
router.put("/:id", async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Alert not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Xóa alert
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Alert.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Alert not found" });
    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
