import { useState, useEffect, useMemo } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import NewRequestModal from "./components/NewRequestModal/NewRequestModal";

import Dashboard from "./pages/dashboard/dashboard";
import Requests from "./pages/requests/requests";
import Systems from "./pages/systems/systems";
import Users from "./pages/users/users";
import Reports from "./pages/reports/reports";
import Settings from "./pages/settings/settings";

import { AVAILABLE_SYSTEMS, STORAGE_KEY, getInitialRequests } from "./data/sampleData";
import {
  formatMonthLabel,
  getAvailableMonths,
  getMonthKey,
  getNextRequestId,
  getRequestViewTitle,
} from "./utils/requestHelpers";

function App() {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getInitialRequests();
  });

  const [screen, setScreen] = useState("dashboard");
  const [monthFilter, setMonthFilter] = useState(() => getMonthKey(new Date()));
  const [systemFilter, setSystemFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [requestView, setRequestView] = useState({
    title: "All Requests",
    status: "All",
    priority: "All",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const monthLabel = formatMonthLabel(new Date());
  const nextRequestId = useMemo(() => getNextRequestId(requests), [requests]);
  const availableMonths = getAvailableMonths(requests);
  const selectedMonth = availableMonths.find((m) => m.value === monthFilter);
  const periodLabel = monthFilter === "all" ? "all months" : selectedMonth?.label ?? monthLabel;
  const pendingAlerts = requests.filter((r) => r.status !== "Completed");

  const filteredRequests = requests.filter((r) => {
    const query = searchQuery.toLowerCase();
    const matchesMonth = monthFilter === "all" || getMonthKey(new Date(r.createdAt)) === monthFilter;
    const matchesSystem = systemFilter === "All" || r.system === systemFilter;
    const matchesStatus = requestView.status === "All" || r.status === requestView.status;
    const matchesPriority = requestView.priority === "All" || r.priority === requestView.priority;
    const matchesSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.system.toLowerCase().includes(query);

    return matchesMonth && matchesSystem && matchesStatus && matchesPriority && matchesSearch;
  });

  /* ---------- Request data handlers ---------- */
  const handleAddRequest = (newReq) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)));
  };

  const handleDeleteRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleResetDemoData = () => {
    const fresh = getInitialRequests();
    setRequests(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  /* ---------- Navigation ---------- */
  const navigateTo = (targetScreen) => {
    setScreen(targetScreen);
    setIsDrawerOpen(false);
  };

  const openRequests = (view = {}) => {
    setRequestView({ title: "All Requests", status: "All", priority: "All", ...view });
    setMonthFilter(getMonthKey(new Date()));
    setSystemFilter("All");
    setSearchQuery("");
    navigateTo("requests");
  };

  const handleSidebarNavigate = (id) => {
    if (id === "requests") openRequests();
    else navigateTo(id);
  };

  const viewSystemRequests = (system) => {
    setSystemFilter(system);
    setMonthFilter("all");
    navigateTo("requests");
  };

  const updateRequestFilter = (key, value) => {
    setRequestView((current) => {
      const updated = { ...current, [key]: value };
      return { ...updated, title: getRequestViewTitle(updated.status, updated.priority) };
    });
  };

  /* ---------- Page header text ---------- */
  const pageHeaders = {
    dashboard: {
      title: "Dashboard",
      subtitle: `Welcome back, Eunice Chikondo. Here is your ${monthLabel} overview.`,
    },
    requests: {
      title: requestView.title,
      subtitle: `Showing ${filteredRequests.length} requests for ${periodLabel}${systemFilter === "All" ? "." : ` in ${systemFilter}.`}`,
    },
    systems: {
      title: "Monitored Systems",
      subtitle: "Overview of active enterprise systems and open feature backlogs.",
    },
    users: {
      title: "Team & Requesters",
      subtitle: "Active contributors and system administrators.",
    },
    reports: {
      title: "Analytics & Reports",
      subtitle: "Exportable completion metrics and system distribution.",
    },
    settings: {
      title: "System Settings",
      subtitle: "Manage local dashboard preferences and sample data.",
    },
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeScreen={screen}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleSidebarNavigate}
      />

      <main className="main-content">
        <Header
          title={pageHeaders[screen].title}
          subtitle={pageHeaders[screen].subtitle}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onNewRequest={() => setIsModalOpen(true)}
          pendingAlerts={pendingAlerts}
          onAlertClick={(item) => openRequests({ status: item.status })}
        />

        {screen === "dashboard" && (
          <Dashboard
            requests={requests}
            onOpenRequests={openRequests}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
          />
        )}

        {screen === "requests" && (
          <Requests
            requests={filteredRequests}
            requestView={requestView}
            periodLabel={periodLabel}
            systems={AVAILABLE_SYSTEMS}
            availableMonths={availableMonths}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            monthFilter={monthFilter}
            onMonthChange={setMonthFilter}
            systemFilter={systemFilter}
            onSystemChange={setSystemFilter}
            onFilterChange={updateRequestFilter}
            onBack={() => navigateTo("dashboard")}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
          />
        )}

        {screen === "systems" && (
          <Systems
            requests={requests}
            systems={AVAILABLE_SYSTEMS}
            onViewSystemRequests={viewSystemRequests}
          />
        )}

        {screen === "users" && <Users requests={requests} />}

        {screen === "reports" && <Reports requests={requests} systems={AVAILABLE_SYSTEMS} />}

        {screen === "settings" && <Settings onResetData={handleResetDemoData} />}
      </main>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRequest}
        systems={AVAILABLE_SYSTEMS}
        nextId={nextRequestId}
      />
    </div>
  );
}

export default App;
