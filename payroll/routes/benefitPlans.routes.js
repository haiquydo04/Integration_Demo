import express from "express";
import BenefitPlan from "../models/BenefitPlan.js";

const router = express.Router();

// Lấy tất cả gói phúc lợi
router.get("/", async (req, res) => {
  try {
    const plans = await BenefitPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy 1 gói theo plan_id
router.get("/:plan_id", async (req, res) => {
  try {
    const plan = await BenefitPlan.findOne({ plan_id: req.params.plan_id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo gói mới
router.post("/", async (req, res) => {
  const plan = new BenefitPlan({
    plan_id: req.body.plan_id,
    plan_name: req.body.plan_name,
    description: req.body.description,
    monthly_employee_contribution: req.body.monthly_employee_contribution,
    monthly_employer_contribution: req.body.monthly_employer_contribution,
    coverage_details: req.body.coverage_details,
    effective_from: req.body.effective_from,
    effective_to: req.body.effective_to
  });

  try {
    const newPlan = await plan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật gói theo plan_id
router.patch("/:plan_id", async (req, res) => {
  try {
    const plan = await BenefitPlan.findOne({ plan_id: req.params.plan_id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    Object.keys(req.body).forEach(key => {
      plan[key] = req.body[key];
    });

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa gói theo plan_id
router.delete("/:plan_id", async (req, res) => {
  try {
    const plan = await BenefitPlan.findOne({ plan_id: req.params.plan_id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await plan.deleteOne();
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
