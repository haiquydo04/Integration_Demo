import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

// Lấy tất cả alert
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ triggered_on: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy 1 alert theo _id
router.get("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo alert mới
router.post("/", async (req, res) => {
  const alert = new Alert({
    employee_id: req.body.employee_id,
    alert_type: req.body.alert_type,
    triggered_on: req.body.triggered_on,
    details: req.body.details
  });

  try {
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật alert
router.patch("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    Object.keys(req.body).forEach(key => {
      alert[key] = req.body[key];
    });

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa alert
router.delete("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    await alert.deleteOne();
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
