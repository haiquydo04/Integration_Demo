import express from "express";
import Vacation from "../models/Vacation.js";

const router = express.Router();

/**
 * @route   GET /api/vacations
 * @desc    Lấy danh sách tất cả kỳ nghỉ
 */
router.get("/", async (req, res) => {
  try {
    const vacations = await Vacation.find();
    res.json(vacations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/vacations/:id
 * @desc    Lấy chi tiết kỳ nghỉ theo ID
 */
router.get("/:id", async (req, res) => {
  try {
    const vacation = await Vacation.findById(req.params.id);
    if (!vacation)
      return res.status(404).json({ message: "Không tìm thấy dữ liệu nghỉ phép" });
    res.json(vacation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/vacations
 * @desc    Thêm mới dữ liệu nghỉ phép
 */
router.post("/", async (req, res) => {
  try {
    const newVacation = new Vacation(req.body);
    const savedVacation = await newVacation.save();
    res.status(201).json(savedVacation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/vacations/:id
 * @desc    Cập nhật thông tin nghỉ phép theo ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedVacation = await Vacation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVacation)
      return res.status(404).json({ message: "Không tìm thấy dữ liệu để cập nhật" });
    res.json(updatedVacation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   DELETE /api/vacations/:id
 * @desc    Xóa dữ liệu nghỉ phép
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Vacation.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy dữ liệu để xóa" });
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
