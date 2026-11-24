import { useState } from "react";
import { AuthContext } from "./AuthContextState";

const DEMO_USER = {
  fullName: "Hellington Vunganayi",
  role: "Developer",
  assignedProjectIds: ["demo-project"],
};

async function postAuthRequest(path, payload, fallbackMessage) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to reach the authentication service.", {
        cause: error,
      });
    }
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? "The authentication service returned an invalid response."
        : fallbackMessage,
    );
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The authentication service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      typeof data.message === "string" && data.message.trim()
        ? data.message
        : fallbackMessage,
    );
  }

  return data;
}

function getAuthenticatedUser(data) {
  const user = data.user;
  if (
    !user ||
    typeof user.fullName !== "string" ||
    typeof user.role !== "string" ||
    !Array.isArray(user.assignedProjectIds)
  ) {
    throw new Error("The authentication service returned an invalid user profile.");
  }

  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const demoMode =
    import.meta.env.DEV && import.meta.env.VITE_AUTH_MODE !== "api";

  async function login({ email, password }) {
    if (demoMode) {
      setUser(DEMO_USER);
      return DEMO_USER;
    }

    const data = await postAuthRequest(
      "/api/auth/login",
      { email, password },
      "Sign-in failed. Check your credentials and try again.",
    );
    const authenticatedUser = getAuthenticatedUser(data);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function signup({ fullName, email, password, inviteCode }) {
    if (demoMode) {
      return {
        pending: true,
        message:
          "Account creation is a preview only. Sign in to open the workspace.",
      };
    }

    const data = await postAuthRequest(
      "/api/auth/signup",
      { fullName, email, password, inviteCode },
      "Account registration failed. Check your details and try again.",
    );

    if (data.status === "pending_approval") {
      return {
        pending: true,
        message:
          typeof data.message === "string"
            ? data.message
            : "Your account request is awaiting Department Admin approval.",
      };
    }

    const authenticatedUser = getAuthenticatedUser(data);
    setUser(authenticatedUser);
    return { pending: false, user: authenticatedUser };
  }

  async function logout() {
    if (demoMode) {
      setUser(null);
      return;
    }

    let response;
    try {
      response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Unable to reach the authentication service to sign out.", {
          cause: error,
        });
      }
      throw error;
    }

    if (!response.ok) {
      throw new Error("Sign out failed. Please try again.");
    }

    setUser(null);
  }

  const value = {
    demoMode,
    user,
    login,
    signup,
    logout,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
