export function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export function getRequestViewTitle(status, priority) {
  const filters = [];
  if (status !== "All") filters.push(status);
  if (priority !== "All") filters.push(`${priority} Priority`);
  return filters.length ? `${filters.join(" ")} Requests` : "All Requests";
}

export function getNextRequestId(requests) {
  const maxNum = requests.reduce((max, r) => {
    const num = parseInt(r.id.replace("FR-", ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `FR-${String(maxNum + 1).padStart(3, "0")}`;
}

export function getAvailableMonths(requests) {
  return [...new Set(requests.map((r) => getMonthKey(new Date(r.createdAt))))]
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [year, month] = key.split("-").map(Number);
      return { value: key, label: formatMonthLabel(new Date(year, month - 1, 1)) };
    });
}

export function exportToCSV(rows) {
  const headers = ["ID", "Title", "System", "Priority", "Status", "Requester", "Created Date"];
  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.system}"`,
        r.priority,
        r.status,
        `"${r.requester || ""}"`,
        new Date(r.createdAt).toISOString().split("T")[0],
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `FTS_Report_${getMonthKey(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
