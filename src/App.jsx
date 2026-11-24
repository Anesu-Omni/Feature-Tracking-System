import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth";

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

  return (
    <main className="workspace-shell">
      <section className="workspace-card">
        <span className="auth-badge">INTERNAL DEPARTMENT PORTAL</span>
        <h1>Welcome, {user.fullName}</h1>
        <p>Your account is connected to the department workspace.</p>
        <div className="workspace-role">
          Role
          <strong>{user.role}</strong>
        </div>
        <p>
          Assigned projects: <strong>{user.assignedProjectIds.length}</strong>
        </p>
        {logoutError && (
          <div className="auth-alert auth-alert-error" role="alert">
            {logoutError}
          </div>
        )}
        <button
          className="workspace-logout"
          type="button"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceGate />
    </AuthProvider>
  );
}
