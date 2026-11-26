import {
  DEMO_COMPANY_DIRECTORY,
  DEVELOPER_DEPARTMENT,
} from "../data/demoCompanyDirectory.js";

// Demo-only account store. Production authentication must happen on a server.

export const ALLOWED_EMAIL_DOMAINS = ["omnicontact.biz", "econet.co.zw"];
export const EMAIL_ERROR_MESSAGE =
  "Use your @omnicontact.biz or @econet.co.zw email, such as john.doe@econet.co.zw.";

const ACCOUNTS_KEY = "fts.auth.accounts";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function isAllowedEmail(email) {
  const value = normalizeEmail(email);
  if (!EMAIL_PATTERN.test(value)) return false;
  const domain = value.slice(value.lastIndexOf("@") + 1);
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export function readAccounts() {
  const raw = window.localStorage.getItem(ACCOUNTS_KEY);
  if (raw === null) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error("Saved demo accounts are invalid.", { cause: error });
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Saved demo accounts are invalid.");
  }

  return parsed;
}

export function writeAccounts(accounts) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    throw new Error("Unable to save the account in this browser.", {
      cause: error,
    });
  }
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

function createSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

function toPublicUser(account) {
  return {
    fullName: account.fullName,
    email: account.email,
    role: account.role,
    department: account.department,
    assignedProjectIds: account.assignedProjectIds,
  };
}

export function findAccountByEmail(email) {
  const target = normalizeEmail(email);
  return readAccounts().find((account) => account.email === target) ?? null;
}

export async function registerAccount({ fullName, email, password, phone }) {
  const normalized = normalizeEmail(email);
  if (!isAllowedEmail(normalized)) throw new Error(EMAIL_ERROR_MESSAGE);

  const directoryEmployee = DEMO_COMPANY_DIRECTORY.find(
    (employee) => normalizeEmail(employee.email) === normalized,
  );
  if (!directoryEmployee || directoryEmployee.department !== DEVELOPER_DEPARTMENT) {
    throw new Error(
      `Registration is limited to employees in the ${DEVELOPER_DEPARTMENT} department.`,
    );
  }

  if (fullName.trim().toLowerCase() !== directoryEmployee.fullName.toLowerCase()) {
    throw new Error("Your name does not match the company directory record.");
  }

  if (findAccountByEmail(normalized)) {
    throw new Error("An account with this email already exists. Sign in instead.");
  }

  const salt = createSalt();
  const account = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalized,
    phone: phone || "",
    salt,
    passwordHash: await hashPassword(password, salt),
    role: "Developer",
    department: directoryEmployee.department,
    assignedProjectIds: ["demo-project"],
    createdAt: new Date().toISOString(),
  };

  writeAccounts([...readAccounts(), account]);
  return toPublicUser(account);
}

export async function verifyCredentials(email, password) {
  const account = findAccountByEmail(email);
  if (!account) return null;
  const hash = await hashPassword(password, account.salt);
  return hash === account.passwordHash ? toPublicUser(account) : null;
}
