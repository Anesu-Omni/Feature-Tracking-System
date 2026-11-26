export const STORAGE_KEY = "fts_requests_v3";

export const AVAILABLE_SYSTEMS = [
  "Payroll Management System",
  "HR Management System",
  "Inventory & Asset Tracker",
  "Customer Support Portal",
];

export const STAKEHOLDERS = [
  { name: "Eunice Chikondo", role: "System Admin", dept: "IT & Systems" },
  { name: "T. Moyo", role: "Payroll Lead", dept: "Finance" },
  { name: "R. Ndlovu", role: "HR Specialist", dept: "Human Resources" },
  { name: "K. Sibanda", role: "HR Coordinator", dept: "Human Resources" },
  { name: "S. Chigumba", role: "Operations Analyst", dept: "Operations" },
];

export const getInitialRequests = () => {
  const now = new Date();
  const dateForMonth = (monthOffset, day) =>
    new Date(now.getFullYear(), now.getMonth() + monthOffset, day).toISOString();

  return [
    { id: "FR-001", title: "Add PDF payslip download", system: "Payroll Management System", priority: "High", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(0, 2) },
    { id: "FR-002", title: "Improve login functionality", system: "HR Management System", priority: "Medium", status: "Completed", requester: "R. Ndlovu", createdAt: dateForMonth(0, 4) },
    { id: "FR-003", title: "Add employee search feature", system: "HR Management System", priority: "Low", status: "Completed", requester: "K. Sibanda", createdAt: dateForMonth(0, 6) },
    { id: "FR-004", title: "Update payment processing", system: "Payroll Management System", priority: "High", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 8) },
    { id: "FR-005", title: "Add leave balance report", system: "HR Management System", priority: "Medium", status: "Completed", requester: "S. Chigumba", createdAt: dateForMonth(0, 10) },
    { id: "FR-006", title: "Automate payroll deductions", system: "Payroll Management System", priority: "High", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 12) },
    { id: "FR-007", title: "Improve onboarding checklist", system: "HR Management System", priority: "Low", status: "Completed", requester: "R. Ndlovu", createdAt: dateForMonth(0, 16) },
    { id: "FR-008", title: "Add audit history", system: "Payroll Management System", priority: "Medium", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(0, 19) },
    { id: "FR-009", title: "Add manager payroll approvals", system: "Payroll Management System", priority: "High", status: "In Progress", requester: "Eunice Chikondo", createdAt: dateForMonth(0, 21) },
    { id: "FR-010", title: "Create a team calendar", system: "HR Management System", priority: "Medium", status: "Pending", requester: "K. Sibanda", createdAt: dateForMonth(0, 23) },
    { id: "FR-011", title: "Add overtime rules", system: "Payroll Management System", priority: "Low", status: "Completed", requester: "T. Moyo", createdAt: dateForMonth(-1, 12) },
    { id: "FR-012", title: "Add employee profile fields", system: "HR Management System", priority: "Low", status: "In Progress", requester: "S. Chigumba", createdAt: dateForMonth(-1, 18) },
    { id: "FR-013", title: "Add overtime approval workflow", system: "Payroll Management System", priority: "Medium", status: "Completed", requester: "Eunice Chikondo", createdAt: dateForMonth(-2, 9) },
    { id: "FR-014", title: "Add team leave calendar", system: "HR Management System", priority: "High", status: "Pending", requester: "R. Ndlovu", createdAt: dateForMonth(-3, 14) },
  ];
};
