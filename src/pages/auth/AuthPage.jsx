import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import "./AuthPage.css";

const SAMPLE_USER_NAME = "Hellington Vunganayi";
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;
const CAPTCHA_CHARACTERS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

const EMPTY_VALUES = {
  fullName: "",
  email: "",
  inviteCode: "",
  phone: "",
  otp: "",
  password: "",
  confirmPassword: "",
};

function generateCaptchaText() {
  let text = "";
  for (let index = 0; index < 6; index += 1) {
    text += CAPTCHA_CHARACTERS.charAt(
      Math.floor(Math.random() * CAPTCHA_CHARACTERS.length),
    );
  }
  return text;
}

function drawCaptcha(canvas, text) {
  const context = canvas?.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#eef4ff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 6; index += 1) {
    context.strokeStyle = "rgba(18, 80, 196, 0.35)";
    context.beginPath();
    context.moveTo(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
    );
    context.lineTo(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
    );
    context.stroke();
  }

  context.font = "bold 26px monospace";
  context.fillStyle = "#0a2a6e";
  for (let index = 0; index < text.length; index += 1) {
    context.save();
    context.translate(18 + index * 29, 32 + (Math.random() * 8 - 4));
    context.rotate((Math.random() - 0.5) * 0.4);
    context.fillText(text[index], 0, 0);
    context.restore();
  }
}

const iconShapes = {
  activity: (
    <>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.9 17.9A10.6 10.6 0 0 1 12 19C5.5 19 2 12 2 12a18.6 18.6 0 0 1 5.1-5.9" />
      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <path d="m3 3 18 18" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9" />
      <path d="m16 7 3 3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3.2a2 2 0 0 1-.6 1.7L7.7 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.7-.6l3.2.5a2 2 0 0 1 1.7 2.4Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </>
  ),
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {iconShapes[name]}
    </svg>
  );
}

const BOARD_COLUMNS = [
  { title: "Idea", tone: "idea", cards: [72, 48] },
  { title: "Planned", tone: "planned", cards: [60, 82, 44] },
  { title: "In progress", tone: "progress", cards: [56, 76] },
  { title: "Released", tone: "done", cards: [90, 66, 80] },
];

function PipelineBackdrop() {
  return (
    <div aria-hidden="true" className="fts-auth__backdrop">
      <span className="fts-auth__glow fts-auth__glow--a" />
      <span className="fts-auth__glow fts-auth__glow--b" />
      <svg className="fts-auth__rings" focusable="false" viewBox="0 0 720 720">
        <circle cx="360" cy="360" r="120" />
        <circle className="is-dashed" cx="360" cy="360" r="200" />
        <circle cx="360" cy="360" r="280" />
        <circle className="is-dashed" cx="360" cy="360" r="350" />
        <circle className="fts-auth__ring-node" cx="160" cy="360" r="5" />
        <circle className="fts-auth__ring-node" cx="558" cy="162" r="5" />
        <circle className="fts-auth__ring-node" cx="360" cy="10" r="7" />
      </svg>
      <div className="fts-auth__board">
        {BOARD_COLUMNS.map((column) => (
          <div
            className={`fts-auth__column fts-auth__column--${column.tone}`}
            key={column.title}
          >
            <div className="fts-auth__column-head">
              <span className="fts-auth__column-dot" />
              {column.title}
              <span className="fts-auth__column-count">
                {column.cards.length}
              </span>
            </div>
            {column.cards.map((width, index) => (
              <div
                className="fts-auth__ticket"
                key={`${column.title}-${index}`}
              >
                <span
                  className="fts-auth__ticket-title"
                  style={{ width: `${width}%` }}
                />
                <span className="fts-auth__ticket-line" />
                <span className="fts-auth__ticket-meta">
                  {column.tone === "done" ? (
                    <Icon
                      className="fts-auth__ticket-check"
                      name="check"
                      size={16}
                    />
                  ) : (
                    <span className="fts-auth__ticket-avatar" />
                  )}
                  <span className="fts-auth__ticket-bar">
                    <span style={{ width: `${Math.max(width - 20, 24)}%` }} />
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizePhone(phone) {
  return phone.replace(/[\s()-]/g, "");
}

function validate(mode, values, otpVerificationId) {
  const errors = {};

  if (mode === "signup" && !values.fullName.trim()) {
    errors.fullName = "Enter your full name.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter your department email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (mode === "signup" && !values.inviteCode.trim()) {
    errors.inviteCode = "Enter the invite code from your department.";
  }

  if (mode === "login") {
    const phone = normalizePhone(values.phone);
    if (!phone) {
      errors.phone = "Enter your mobile number.";
    } else if (!PHONE_PATTERN.test(phone)) {
      errors.phone = "Enter a valid number with its country code, such as +263.";
    } else if (!otpVerificationId) {
      errors.phone = "Send a verification code to your mobile number first.";
    }

    if (otpVerificationId && !values.otp.trim()) {
      errors.otp = "Enter the verification code sent to your mobile.";
    }

  }

  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (mode === "signup") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}

function AuthField({
  autoComplete,
  disabled,
  error,
  hint,
  icon,
  id,
  label,
  name,
  onBlur,
  onChange,
  onToggle,
  action,
  placeholder,
  type = "text",
  value,
  visible,
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");
  const isPassword = type === "password" || type === "text-password";

  return (
    <div className="fts-auth__field">
      <label className="fts-auth__label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`fts-auth__control${error ? " is-invalid" : ""}${
          disabled ? " is-disabled" : ""
        }`}
      >
        <span className="fts-auth__control-icon">
          <Icon name={icon} />
        </span>
        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className="fts-auth__input"
          disabled={disabled}
          id={id}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          spellCheck={false}
          type={isPassword && visible ? "text" : isPassword ? "password" : type}
          value={value}
        />
        {isPassword && (
          <button
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={visible}
            className="fts-auth__toggle"
            disabled={disabled}
            onClick={onToggle}
            type="button"
          >
            <Icon name={visible ? "eyeOff" : "eye"} />
          </button>
        )}
        {action}
      </div>
      {hint && !error && (
        <span className="fts-auth__hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="fts-auth__error" id={errorId}>
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}

function TextCaptcha({ onVerify }) {
  const uid = useId();
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState(generateCaptchaText);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    drawCaptcha(canvasRef.current, captchaText);
  }, [captchaText]);

  function refreshCaptcha() {
    setCaptchaText(generateCaptchaText());
    setUserInput("");
    setStatus("idle");
    onVerify(false);
  }

  function handleChange(event) {
    const value = event.target.value;
    const isVerified =
      value.trim().toLowerCase() === captchaText.toLowerCase();
    setUserInput(value);
    setStatus(
      isVerified
        ? "valid"
        : value.length >= captchaText.length
          ? "invalid"
          : "idle",
    );
    onVerify(isVerified);
  }

  return (
    <div className="fts-auth__captcha">
      <p className="fts-auth__label">CAPTCHA verification</p>
      <div className="fts-auth__captcha-challenge">
        <canvas
          aria-label="Distorted CAPTCHA text. Enter the characters shown."
          className="fts-auth__captcha-canvas"
          height="50"
          ref={canvasRef}
          role="img"
          width="200"
        />
        <button
          aria-label="Generate a new CAPTCHA"
          className="fts-auth__captcha-refresh"
          onClick={refreshCaptcha}
          type="button"
        >
          Refresh
        </button>
      </div>
      <AuthField
        autoComplete="off"
        error={
          status === "invalid" ? "The CAPTCHA text does not match." : ""
        }
        icon="key"
        id={`${uid}-answer`}
        label="Enter the text shown"
        name="captchaAnswer"
        onChange={handleChange}
        placeholder="Enter the characters above"
        value={userInput}
      />
      {status === "valid" && (
        <span className="fts-auth__captcha-success" role="status">
          CAPTCHA verified.
        </span>
      )}
    </div>
  );
}

export default function AuthPage({ onAuthenticated }) {
  const {
    demoMode,
    login,
    requestPasswordReset,
    requestPhoneOtp,
    signup,
  } = useAuth();
  const uid = useId();
  const formRef = useRef(null);
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState(EMPTY_VALUES);
  const [otpVerificationId, setOtpVerificationId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState({ type: "idle" });
  const [hasModeSwitched, setHasModeSwitched] = useState(false);

  const isLoading =
    status.type === "loading" ||
    status.type === "sending-otp" ||
    status.type === "sending-reset";
  const isSignup = mode === "signup";
  const errors = demoMode
    ? {}
    : validate(mode, values, otpVerificationId);
  const fieldId = (name) => `${uid}-${name}`;
  const visibleError = (name) =>
    touched[name] || submitted ? errors[name] : "";

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) =>
      name === "phone"
        ? { ...current, phone: value, otp: "" }
        : { ...current, [name]: value },
    );
    if (name === "phone") {
      setOtpVerificationId("");
      setOtpSent(false);
    }
    if (status.type === "error" || status.type === "info") {
      setStatus({ type: "idle" });
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function switchMode(nextMode) {
    if (nextMode === mode || isLoading) return;
    setHasModeSwitched(true);
    setMode(nextMode);
    setTouched({});
    setSubmitted(false);
    setShowPassword(false);
    setShowConfirm(false);
    setStatus({ type: "idle" });
    setOtpVerificationId("");
    setOtpSent(false);
    setCaptchaVerified(false);
    setCaptchaKey((current) => current + 1);
    setValues((current) => ({ ...EMPTY_VALUES, email: current.email }));
  }

  function handleTabKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const nextMode = mode === "login" ? "signup" : "login";
    switchMode(nextMode);
    requestAnimationFrame(() => {
      document.getElementById(`${uid}-tab-${nextMode}`)?.focus();
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isLoading) return;

    if (demoMode && isSignup) {
      switchMode("login");
      setStatus({
        type: "info",
        message:
          "Account creation is a preview only. Sign in to open the workspace.",
      });
      return;
    }

    setSubmitted(true);
    const currentErrors = demoMode
      ? {}
      : validate(mode, values, otpVerificationId);
    const firstInvalid = Object.keys(currentErrors)[0];
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    setStatus({ type: "loading" });
    try {
      if (isSignup) {
        const result = await signup({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
          inviteCode: values.inviteCode.trim(),
        });

        if (result?.pending) {
          setStatus({
            type: "pending",
            message:
              result.message ||
              "Your request has been sent. A department administrator will review and approve your account.",
          });
          return;
        }

        setStatus({
          type: "success",
          fullName: result?.user?.fullName || SAMPLE_USER_NAME,
          message: "Your account is ready. Loading your workspace...",
        });
        onAuthenticated?.(result?.user);
        return;
      }

      const user = await login({
        email: values.email.trim(),
        password: values.password,
        phone: normalizePhone(values.phone),
        otp: values.otp.trim(),
        otpVerificationId,
      });
      setStatus({
        type: "success",
        fullName: user?.fullName || SAMPLE_USER_NAME,
        message: "You are signed in. Loading your workspace...",
      });
      onAuthenticated?.(user);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : isSignup
              ? "We couldn't create your account. Check your details and invite code, then try again."
              : "We couldn't sign you in. Check your email and password, then try again.",
      });
    }
  }

  async function handleSendOtp() {
    if (isLoading) return;
    const phone = normalizePhone(values.phone);
    if (!PHONE_PATTERN.test(phone)) {
      setTouched((current) => ({ ...current, phone: true }));
      setStatus({
        type: "error",
        message: "Enter a valid mobile number with its country code before requesting a code.",
      });
      formRef.current?.elements.phone?.focus();
      return;
    }

    if (!captchaVerified) {
      setStatus({
        type: "error",
        message: "Complete the CAPTCHA before requesting a code.",
      });
      return;
    }

    setStatus({ type: "sending-otp" });
    try {
      const result = await requestPhoneOtp({ phone });
      setOtpVerificationId(result.verificationId);
      setOtpSent(true);
      setCaptchaVerified(false);
      setCaptchaKey((current) => current + 1);
      setValues((current) => ({ ...current, otp: "" }));
      setStatus({
        type: "info",
        message: `A verification code was sent to ${phone}.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't send a verification code. Check your number and try again.",
      });
    }
  }

  async function handleForgotPassword() {
    if (isLoading) return;
    const email = values.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      setTouched((current) => ({ ...current, email: true }));
      setStatus({
        type: "error",
        message: "Enter a valid department email to request a password reset.",
      });
      formRef.current?.elements.email?.focus();
      return;
    }

    setStatus({ type: "sending-reset" });
    try {
      await requestPasswordReset({ email });
      setStatus({
        type: "info",
        message:
          "If an account exists for that email, a password reset link will be sent.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't request a password reset. Please try again.",
      });
    }
  }

  function backToSignIn() {
    switchMode("login");
  }

  let resultView = null;
  if (status.type === "pending") {
    resultView = (
      <div className="fts-auth__result" role="status">
        <span className="fts-auth__result-icon fts-auth__result-icon--pending">
          <Icon name="clock" size={32} />
        </span>
        <h2 className="fts-auth__result-title">Account pending approval</h2>
        <p className="fts-auth__result-text">{status.message}</p>
        <p className="fts-auth__result-text fts-auth__result-text--muted">
          You’ll be able to sign in once your account has been approved.
        </p>
        <button
          className="fts-auth__button fts-auth__button--secondary"
          onClick={backToSignIn}
          type="button"
        >
          Back to sign in
        </button>
      </div>
    );
  } else if (status.type === "success") {
    resultView = (
      <div className="fts-auth__result" role="status">
        <span className="fts-auth__result-icon fts-auth__result-icon--success">
          <Icon name="check" size={32} />
        </span>
        <h2 className="fts-auth__result-title">
          Welcome, {status.fullName || SAMPLE_USER_NAME}
        </h2>
        <p className="fts-auth__result-text">{status.message}</p>
        <span className="fts-auth__result-loader">
          <Icon className="fts-auth__spinner" name="activity" size={22} />
        </span>
      </div>
    );
  }

  const passwordHint = isSignup
    ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    : undefined;

  return (
    <div
      className={`fts-auth${isSignup ? " is-signup" : ""}${
        hasModeSwitched ? " has-mode-switched" : ""
      }`}
    >
      <aside
        aria-label="About the Feature Tracking System"
        className="fts-auth__brand"
      >
        <PipelineBackdrop />
        <div className="fts-auth__brand-inner">
          <div className="fts-auth__logo">
            <span aria-hidden="true" className="fts-auth__logo-mark">
              FTS
            </span>
            <span className="fts-auth__logo-name">Feature Tracking System</span>
          </div>

          <div className="fts-auth__pitch" key={mode}>
            <h1 className="fts-auth__headline">
              {isSignup
                ? "Join your team and move great ideas forward."
                : "One place to track every feature, from idea to release."}
            </h1>
            <p className="fts-auth__subhead">
              {isSignup
                ? "Request internal access with your department invite and connect to the projects assigned to you."
                : "Pick up where your team left off and see the features assigned to you."}
            </p>
            <ul className="fts-auth__points">
              <li>
                <span className="fts-auth__point-icon">
                  <Icon name="activity" />
                </span>
                <span>
                  <strong>Track your work</strong>
                  <small>See the status of every feature at a glance.</small>
                </span>
              </li>
              <li>
                <span className="fts-auth__point-icon">
                  <Icon name="shield" />
                </span>
                <span>
                  <strong>Assignment-based access</strong>
                  <small>Project visibility is based on your assignments.</small>
                </span>
              </li>
              <li>
                <span className="fts-auth__point-icon">
                  <Icon name="users" />
                </span>
                <span>
                  <strong>Team ownership</strong>
                  <small>Every feature has a clear owner on the team.</small>
                </span>
              </li>
            </ul>
          </div>

          <p className="fts-auth__brand-footer">
            Internal use only · Feature Tracking System
          </p>
        </div>
      </aside>

      <main className="fts-auth__main">
        <div className="fts-auth__card">
          <div className="fts-auth__content" key={mode}>
            {resultView ? (
              resultView
            ) : (
              <>
              <header className="fts-auth__header">
                <h2 className="fts-auth__title">
                  {isSignup ? "Create your account" : "Sign in to FTS"}
                </h2>
                <p className="fts-auth__lead">
                  {isSignup
                    ? "For department members with an invite code. New accounts need approval, then you’ll see the projects you’re assigned to."
                    : "Use your department email to continue to the Feature Tracking System."}
                </p>
              </header>

              <div
                aria-label="Authentication mode"
                className="fts-auth__tabs"
                role="tablist"
              >
                <button
                  aria-controls={`${uid}-panel`}
                  aria-selected={!isSignup}
                  className={`fts-auth__tab${!isSignup ? " is-active" : ""}`}
                  disabled={isLoading}
                  id={`${uid}-tab-login`}
                  onClick={() => switchMode("login")}
                  onKeyDown={handleTabKeyDown}
                  role="tab"
                  tabIndex={!isSignup ? 0 : -1}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  aria-controls={`${uid}-panel`}
                  aria-selected={isSignup}
                  className={`fts-auth__tab${isSignup ? " is-active" : ""}`}
                  disabled={isLoading}
                  id={`${uid}-tab-signup`}
                  onClick={() => switchMode("signup")}
                  onKeyDown={handleTabKeyDown}
                  role="tab"
                  tabIndex={isSignup ? 0 : -1}
                  type="button"
                >
                  Create Account
                </button>
              </div>

              <form
                aria-busy={isLoading}
                aria-labelledby={`${uid}-tab-${mode}`}
                className="fts-auth__form"
                id={`${uid}-panel`}
                key={mode}
                noValidate
                onSubmit={handleSubmit}
                ref={formRef}
                role="tabpanel"
              >
                {isSignup && (
                  <AuthField
                    autoComplete="name"
                    disabled={isLoading}
                    error={visibleError("fullName")}
                    icon="user"
                    id={fieldId("fullName")}
                    label="Full name"
                    name="fullName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={SAMPLE_USER_NAME}
                    value={values.fullName}
                  />
                )}
                <AuthField
                  autoComplete="email"
                  disabled={isLoading}
                  error={visibleError("email")}
                  icon="mail"
                  id={fieldId("email")}
                  label="Department email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="name@department.org"
                  type="email"
                  value={values.email}
                />
                {isSignup && (
                  <AuthField
                    autoComplete="off"
                    disabled={isLoading}
                    error={visibleError("inviteCode")}
                    hint="Provided by your department administrator."
                    icon="key"
                    id={fieldId("inviteCode")}
                    label="Department invite code"
                    name="inviteCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter invite code"
                    value={values.inviteCode}
                  />
                )}
                {!isSignup && (
                  <>
                    <AuthField
                      autoComplete="tel"
                      disabled={isLoading}
                      error={visibleError("phone")}
                      hint="Include your country code, for example +263."
                      icon="phone"
                      id={fieldId("phone")}
                      label="Mobile number"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="+263 77 123 4567"
                      type="tel"
                      value={values.phone}
                      action={
                        <button
                          className="fts-auth__action-button"
                          disabled={isLoading}
                          onClick={handleSendOtp}
                          type="button"
                        >
                          {otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      }
                    />
                    {otpSent && (
                      <AuthField
                        autoComplete="one-time-code"
                        disabled={isLoading}
                        error={visibleError("otp")}
                        icon="key"
                        id={fieldId("otp")}
                        label="Mobile verification code"
                        name="otp"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter the code from your SMS"
                        value={values.otp}
                      />
                    )}
                    <TextCaptcha
                      key={captchaKey}
                      onVerify={setCaptchaVerified}
                    />
                  </>
                )}
                <AuthField
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  disabled={isLoading}
                  error={visibleError("password")}
                  hint={passwordHint}
                  icon="shield"
                  id={fieldId("password")}
                  label="Password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onToggle={() => setShowPassword((current) => !current)}
                  placeholder={isSignup ? "Create a password" : "Enter your password"}
                  type="password"
                  value={values.password}
                  visible={showPassword}
                />
                {!isSignup && (
                  <button
                    className="fts-auth__forgot"
                    disabled={isLoading}
                    onClick={handleForgotPassword}
                    type="button"
                  >
                    Forgot password?
                  </button>
                )}
                {isSignup && (
                  <AuthField
                    autoComplete="new-password"
                    disabled={isLoading}
                    error={visibleError("confirmPassword")}
                    icon="shield"
                    id={fieldId("confirmPassword")}
                    label="Confirm password"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onToggle={() => setShowConfirm((current) => !current)}
                    placeholder="Re-enter your password"
                    type="password"
                    value={values.confirmPassword}
                    visible={showConfirm}
                  />
                )}

                {status.type === "info" && (
                  <div
                    className="fts-auth__banner fts-auth__banner--info"
                    role="status"
                  >
                    <Icon name="alert" />
                    <p>{status.message}</p>
                  </div>
                )}
                {status.type === "error" && (
                  <div
                    className="fts-auth__banner fts-auth__banner--error"
                    role="alert"
                  >
                    <Icon name="alert" />
                    <p>{status.message}</p>
                  </div>
                )}
                {isLoading && (
                  <div
                    className="fts-auth__banner fts-auth__banner--info"
                    role="status"
                  >
                    <Icon className="fts-auth__spinner" name="activity" />
                    <p>
                      {status.type === "sending-otp"
                        ? "Sending your verification code..."
                        : status.type === "sending-reset"
                          ? "Requesting your password reset..."
                        : isSignup
                          ? "Creating your account..."
                          : "Signing you in..."}
                    </p>
                  </div>
                )}

                <button
                  className="fts-auth__button fts-auth__button--primary"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Icon className="fts-auth__spinner" name="activity" size={18} />
                      <span>
                        {status.type === "sending-otp"
                          ? "Sending code..."
                          : status.type === "sending-reset"
                            ? "Sending reset link..."
                            : isSignup
                              ? "Creating account..."
                              : "Signing in..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{isSignup ? "Create account" : "Sign in"}</span>
                      <Icon name="arrow" size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="fts-auth__switch">
                {isSignup ? "Already have an account?" : "New to the department?"}{" "}
                <button
                  className="fts-auth__link"
                  disabled={isLoading}
                  onClick={() => switchMode(isSignup ? "login" : "signup")}
                  type="button"
                >
                  {isSignup ? "Sign in" : "Create an account"}
                </button>
              </p>
              </>
            )}
          </div>
        </div>

        <p className="fts-auth__legal">
          FTS is for internal department members only.
        </p>
      </main>
    </div>
  );
}
