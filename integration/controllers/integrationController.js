import axios from "axios";

const HR_API = "http://localhost:5001/api";
const PAYROLL_API = "http://localhost:5002/api";

export const getTotalEarnings = async (req, res) => {
  try {
    const { data: salaries } = await axios.get(`${PAYROLL_API}/salaries`);

    const totals = {};
    for (const s of salaries) {
      const dept = s.department;
      if (!totals[dept]) totals[dept] = 0;
      totals[dept] += s.net_pay;
    }

    res.json(totals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVacationSummary = async (req, res) => {
  try {
    // 1️⃣ Lấy dữ liệu từ 2 API HR
    const { data: employees } = await axios.get(`${HR_API}/employees`);
    const { data: vacations } = await axios.get(`${HR_API}/vacations`);

    // 2️⃣ Gộp dữ liệu dựa vào employee_id
    const merged = vacations.map(vac => {
      const emp = employees.find(e => e.employee_id === vac.employee_id);
      return {
        employee_id: vac.employee_id,
        year: vac.year,
        gender: emp?.gender,
        ethnicity: emp?.ethnicity,
        shareholder: emp?.shareholder ? "Shareholder" : "Non-Shareholder",
        employment_type: emp?.employment_type,
        vacation_days_taken: vac.vacation_days_taken
      };
    });

    // 3️⃣ Gom nhóm theo các tiêu chí
    const summary = {};

    for (const rec of merged) {
      const key = `${rec.year}-${rec.gender}-${rec.ethnicity}-${rec.shareholder}-${rec.employment_type}`;
      if (!summary[key]) summary[key] = 0;
      summary[key] += rec.vacation_days_taken;
    }

    // 4️⃣ Biến đổi output thành mảng dễ đọc hơn
    const formatted = Object.entries(summary).map(([key, total_days]) => {
      const [year, gender, ethnicity, shareholder, type] = key.split("-");
      return { year, gender, ethnicity, shareholder, employment_type: type, total_vacation_days: total_days };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAverageBenefits = async (req, res) => {
  try {
    const { year, plan } = req.query;

    // 1) Lấy dữ liệu benefits từ Payroll (có thể trả nhiều bản ghi)
    const benefitsResp = await axios.get(`${PAYROLL_API}/benefits`);
    let benefits = benefitsResp.data || [];

    // nếu muốn lọc theo năm, kiểm tra start_date/end_date hoặc last_modified
    if (year) {
      const y = Number(year);
      benefits = benefits.filter(b => {
        // convert về năm từ start_date hoặc last_modified nếu có
        const startYear = b.start_date ? new Date(b.start_date).getFullYear() : null;
        const endYear   = b.end_date   ? new Date(b.end_date).getFullYear()   : null;
        const lastYear  = b.last_modified ? new Date(b.last_modified).getFullYear() : null;
        return startYear === y || endYear === y || lastYear === y;
      });
    }

    // nếu lọc theo plan id hoặc plan name
    if (plan) {
      const p = plan.toLowerCase();
      benefits = benefits.filter(b =>
        (b.benefit_plan_id && String(b.benefit_plan_id).toLowerCase().includes(p)) ||
        (b.plan_name && String(b.plan_name).toLowerCase().includes(p))
      );
    }

    // 2) Lấy danh sách employees từ HR để biết shareholder status
    const employeesResp = await axios.get(`${HR_API}/employees`);
    const employees = employeesResp.data || [];

    // 3) Gộp and group: theo plan_name (hoặc benefit_plan_id) và shareholder status
    // We'll use key = `${plan_key}||${shareholderStatus}`
    const groups = {}; // { key: { sum: Number, count: Number, plan_name, plan_id, shareholder } }

    for (const b of benefits) {
      // compute total monthly cost for this employee's benefit record
      // use monthly_contribution + employer_contribution (fall back to 0)
      const employeePart = Number(b.monthly_contribution || 0);
      const employerPart = Number(b.employer_contribution || 0);
      const totalMonthly = employeePart + employerPart;

      // find employee to determine shareholder status
      const emp = employees.find(e => e.employee_id === b.employee_id);
      const shareholder = emp ? !!emp.shareholder : false; // boolean

      // choose group key
      const planKey = b.benefit_plan_id || b.plan_name || "UnknownPlan";
      const groupKey = `${planKey}||${shareholder ? "shareholder" : "non-shareholder"}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          plan_id: b.benefit_plan_id || null,
          plan_name: b.plan_name || null,
          shareholder: shareholder,
          sumMonthly: 0,
          count: 0
        };
      }

      groups[groupKey].sumMonthly += totalMonthly;
      groups[groupKey].count += 1;
    }

    // 4) Prepare response: average = sumMonthly / count
    const result = Object.values(groups).map(g => ({
      plan_id: g.plan_id,
      plan_name: g.plan_name,
      shareholder: g.shareholder ? "Shareholder" : "Non-Shareholder",
      average_monthly_contribution: g.count ? +(g.sumMonthly / g.count).toFixed(2) : 0,
      sample_count: g.count
    }));

    // If no groups found, return empty list
    res.json(result);
  } catch (err) {
    console.error("getAverageBenefits error:", err?.message || err);
    res.status(500).json({ message: err?.message || "Integration error" });
  }
};

export const getEmployeeDetails = async (req, res) => {
  const { filter, value } = req.query;
  try {
    // Lấy toàn bộ danh sách từ HR API
    const { data: employees } = await axios.get(`${HR_API}/employees`);

    // Lọc theo điều kiện query (filter + value)
    const filtered = employees.filter(emp => String(emp[filter]) === String(value));

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee details", error });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const [hrResp, payrollResp] = await Promise.all([
      axios.get(`${HR_API}/alerts`),
      axios.get(`${PAYROLL_API}/alerts`)
    ]);

    const hrAlerts = hrResp.data || [];
    const payrollAlerts = payrollResp.data || [];

    const { data: employees } = await axios.get(`${HR_API}/employees`);

    const combinedAlerts = [...hrAlerts, ...payrollAlerts].map(alert => {
      const emp = employees.find(e => e.employee_id === alert.employee_id);
      return {
        employee_id: alert.employee_id,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : "Unknown",
        department: emp?.department || "N/A",
        employment_type: emp?.employment_type || "N/A",
        shareholder: emp?.shareholder ? "Shareholder" : "Non-Shareholder",
        alert_type: alert.alert_type,
        triggered_on: alert.triggered_on,
        details: alert.details,
        source: hrAlerts.includes(alert) ? "HR System" : "Payroll System"
      };
    });

    combinedAlerts.sort(
      (a, b) => new Date(b.triggered_on) - new Date(a.triggered_on)
    );

    res.json({
      count: combinedAlerts.length,
      alerts: combinedAlerts
    });
  } catch (err) {
    console.error("getAlerts error:", err.message);
    res.status(500).json({
      message: "Error fetching alerts from HR/Payroll",
      error: err.message
    });
  }
};

