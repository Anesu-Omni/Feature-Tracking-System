import { useState } from "react";
import { AuthContext } from "./AuthContextState";
import { registerAccount, verifyCredentials } from "./authStorage";

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
    const error = new Error(
      typeof data.message === "string" && data.message.trim()
        ? data.message
        : fallbackMessage,
    );
    error.status = response.status;
    throw error;
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

  async function login({
    email,
    password,
    phone,
    otp,
    otpVerificationId,
  }) {
    if (demoMode) {
      const account = await verifyCredentials(email, password);
      if (!account) {
        throw new Error("Incorrect email or password.");
      }
      setUser(account);
      return account;
    }

    const payload = { email, password };
    if (phone) {
      payload.phone = phone;
      if (otp) {
        payload.otp = otp;
        payload.otpVerificationId = otpVerificationId;
      }
    }

    const data = await postAuthRequest(
      "/api/auth/login",
      payload,
      "Sign-in failed. Check your credentials and try again.",
    );
    const authenticatedUser = getAuthenticatedUser(data);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function requestPhoneOtp({ phone }) {
    if (demoMode) {
      throw new Error(
        "SMS verification isn't available in the demo. You can leave the mobile number and code blank.",
      );
    }

    const data = await postAuthRequest(
      "/api/auth/otp/send",
      { phone },
      "We couldn't send a verification code. Check your number and try again.",
    );
    if (typeof data.verificationId !== "string" || !data.verificationId) {
      throw new Error("The authentication service returned an invalid OTP response.");
    }

    return { verificationId: data.verificationId };
  }

  async function requestPasswordReset({ email }) {
    if (demoMode) {
      throw new Error(
        "Password reset is unavailable in preview mode. Configure the live authentication API to enable it.",
      );
    }

    await postAuthRequest(
      "/api/auth/password/forgot",
      { email },
      "We couldn't request a password reset. Please try again.",
    );
  }

  async function signup({ fullName, email, password, inviteCode }) {
    if (demoMode) {
      const newUser = await registerAccount({ fullName, email, password });
      setUser(newUser);
      return { pending: false, user: newUser };
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
    requestPasswordReset,
    requestPhoneOtp,
    signup,
    logout,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
