import { useState, useEffect, useMemo } from "react";
import "./App.css";

import AuthPage from "./pages/auth/AuthPage";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth";

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
import { getPermissions, getRoleLabel } from "./utils/permissions";

function Workspace({ user, onLogout, logoutError }) {
  const activeUser = user;
  const permissions = useMemo(() => getPermissions(activeUser), [activeUser]);
  const roleLabel = getRoleLabel(activeUser);
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

  const roleScopedRequests = useMemo(() => {
    if (permissions.isDev) {
      return requests.filter((request) => request.assignedDeveloper === activeUser.fullName);
    }
    return permissions.canViewAllRequests ? requests : [];
  }, [requests, permissions.canViewAllRequests, permissions.isDev, activeUser.fullName]);

  const monthLabel = formatMonthLabel(new Date());
  const nextRequestId = useMemo(() => getNextRequestId(requests), [requests]);
  const availableMonths = getAvailableMonths(roleScopedRequests);
  const selectedMonth = availableMonths.find((m) => m.value === monthFilter);
  const periodLabel = monthFilter === "all" ? "all months" : selectedMonth?.label ?? monthLabel;
  const pendingAlerts = roleScopedRequests.filter((r) => r.status !== "Completed");

  const filteredRequests = roleScopedRequests.filter((r) => {
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
    if (!permissions.canCreateRequest) return;
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleDeleteRequest = (id) => {
    if (!permissions.canDeleteRequest) return;
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleResetDemoData = () => {
    const fresh = getInitialRequests();
    setRequests(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  /* ---------- Navigation ---------- */
  const navigateTo = (targetScreen) => {
    const screenPermissions = {
      requests: permissions.canViewRequests,
      systems: permissions.canViewSystems,
      users: permissions.canViewUsers,
      reports: permissions.canViewReports,
      settings: permissions.canViewSettings,
    };
    if (screenPermissions[targetScreen] === false) return;
    setScreen(targetScreen);
    setIsDrawerOpen(false);
  };

  const openRequests = (view = {}) => {
    const { monthFilter: targetMonth, ...requestFilters } = view;
    setRequestView({
      title: "All Requests",
      status: "All",
      priority: "All",
      ...requestFilters,
    });
    setMonthFilter(targetMonth || getMonthKey(new Date()));
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
      title: permissions.isPM ? "Department Oversight" : "Dashboard",
      subtitle: permissions.isPM
        ? `Welcome back, ${activeUser.fullName} (${roleLabel}). Read-only overview for ${monthLabel}.`
        : `Welcome back, ${activeUser.fullName} (${roleLabel}). Here is your ${monthLabel} overview.`,
    },
    requests: {
      title: permissions.isDev ? "My Assigned Requests" : requestView.title,
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
        user={activeUser}
        roleLabel={roleLabel}
        permissions={permissions}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Header
          title={pageHeaders[screen].title}
          subtitle={pageHeaders[screen].subtitle}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onNewRequest={permissions.canCreateRequest ? () => setIsModalOpen(true) : null}
          pendingAlerts={pendingAlerts}
          onAlertClick={(item) => openRequests({ status: item.status })}
          user={activeUser}
        />

        {logoutError && (
          <div className="auth-alert auth-alert-error" role="alert">
            {logoutError}
          </div>
        )}

        {screen === "dashboard" && (
          <Dashboard
            requests={roleScopedRequests}
            permissions={permissions}
            onOpenRequests={openRequests}
            onDelete={handleDeleteRequest}
          />
        )}

        {screen === "requests" && (
          <Requests
            requests={filteredRequests}
            permissions={permissions}
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
            onDelete={handleDeleteRequest}
          />
        )}

        {screen === "systems" && (
          <Systems
            requests={roleScopedRequests}
            systems={AVAILABLE_SYSTEMS}
            onViewSystemRequests={viewSystemRequests}
          />
        )}

        {screen === "users" && permissions.canViewUsers && <Users requests={requests} />}

        {screen === "reports" && permissions.canViewReports && (
          <Reports requests={requests} systems={AVAILABLE_SYSTEMS} />
        )}

        {screen === "settings" && permissions.canViewSettings && (
          <Settings onResetData={handleResetDemoData} />
        )}
      </main>

      {permissions.canCreateRequest && (
        <NewRequestModal
          key={activeUser.fullName}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddRequest}
          systems={AVAILABLE_SYSTEMS}
          nextId={nextRequestId}
          defaultRequester={activeUser.fullName}
        />
      )}
    </div>
  );
}

function WorkspaceGate() {
  const { user, isAuthenticated, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    }
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Workspace user={user} onLogout={handleLogout} logoutError={logoutError} />;
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceGate />
    </AuthProvider>
  );
}
