import express from "express";
import Benefit from "../models/Benefit.js";

const router = express.Router();

// 🔹 Lấy tất cả benefits
router.get("/", async (req, res) => {
  try {
    const benefits = await Benefit.find();
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Lấy benefit theo ID
router.get("/:id", async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id);
    if (!benefit) return res.status(404).json({ message: "Benefit not found" });
    res.json(benefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Lấy benefits theo employee_id
router.get("/employee/:employee_id", async (req, res) => {
  try {
    const benefits = await Benefit.find({ employee_id: req.params.employee_id });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Thêm benefit mới
router.post("/", async (req, res) => {
  try {
    const newBenefit = new Benefit(req.body);
    const savedBenefit = await newBenefit.save();
    res.status(201).json(savedBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Cập nhật benefit
router.put("/:id", async (req, res) => {
  try {
    const updatedBenefit = await Benefit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBenefit) return res.status(404).json({ message: "Benefit not found" });
    res.json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Xóa benefit
router.delete("/:id", async (req, res) => {
  try {
    const deletedBenefit = await Benefit.findByIdAndDelete(req.params.id);
    if (!deletedBenefit) return res.status(404).json({ message: "Benefit not found" });
    res.json({ message: "Benefit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
