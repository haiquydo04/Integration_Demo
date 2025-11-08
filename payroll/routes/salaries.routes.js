import express from "express";
import Salary from "../models/Salary.js";

const router = express.Router();

// 🔹 Lấy danh sách tất cả salary
router.get("/", async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Lấy 1 salary theo id
router.get("/:id", async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Lấy salary theo employee_id
router.get("/employee/:employee_id", async (req, res) => {
  try {
    const salaries = await Salary.find({ employee_id: req.params.employee_id });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Thêm mới salary
router.post("/", async (req, res) => {
  try {
    const newSalary = new Salary(req.body);
    const savedSalary = await newSalary.save();
    res.status(201).json(savedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Cập nhật salary
router.put("/:id", async (req, res) => {
  try {
    const updatedSalary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSalary) return res.status(404).json({ message: "Salary not found" });
    res.json(updatedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Xóa salary
router.delete("/:id", async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
    if (!deletedSalary) return res.status(404).json({ message: "Salary not found" });
    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
