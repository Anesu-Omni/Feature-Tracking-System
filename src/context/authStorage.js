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
const DEMO_LOGIN_CREDENTIALS = [
  {
    email: "project.manager@omnicontact.biz",
    password: "FtS-Manager-2026!",
  },
  {
    email: "eunice.chikondo@omnicontact.biz",
    password: "FtS-Supervisor-2026!",
  },
  {
    email: "anesu@econet.co.zw",
    password: "FtS-Leader-2026!",
  },
  {
    email: "developer.demo@econet.co.zw",
    password: "FtS-Developer-2026!",
  },
];

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
    position: account.position,
    department: account.department,
    assignedProjectIds: account.assignedProjectIds,
  };
}

async function createStoredAccount(employee, password) {
  const salt = createSalt();
  return {
    id: crypto.randomUUID(),
    fullName: employee.fullName,
    email: normalizeEmail(employee.email),
    phone: "",
    salt,
    passwordHash: await hashPassword(password, salt),
    role: employee.role || "Developer",
    position: employee.position || null,
    department: employee.department,
    assignedProjectIds: employee.assignedProjectIds || ["demo-project"],
    createdAt: new Date().toISOString(),
  };
}

async function ensureDemoAccounts() {
  const accounts = readAccounts();
  const newAccounts = [];

  for (const credentials of DEMO_LOGIN_CREDENTIALS) {
    if (accounts.some((account) => account.email === credentials.email)) {
      continue;
    }

    const employee = DEMO_COMPANY_DIRECTORY.find(
      (entry) => normalizeEmail(entry.email) === credentials.email,
    );
    if (!employee || employee.department !== DEVELOPER_DEPARTMENT) {
      throw new Error(
        `Demo credentials are missing a ${DEVELOPER_DEPARTMENT} directory entry.`,
      );
    }

    newAccounts.push(await createStoredAccount(employee, credentials.password));
  }

  if (newAccounts.length) {
    writeAccounts([...accounts, ...newAccounts]);
  }

  return [...accounts, ...newAccounts];
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

  const accounts = await ensureDemoAccounts();
  if (accounts.some((account) => account.email === normalized)) {
    throw new Error("An account with this email already exists. Sign in instead.");
  }

  const account = await createStoredAccount(directoryEmployee, password);
  account.fullName = fullName.trim();
  account.phone = phone || "";
  writeAccounts([...accounts, account]);
  return toPublicUser(account);
}

export async function verifyCredentials(email, password) {
  const accounts = await ensureDemoAccounts();
  const target = normalizeEmail(email);
  const account = accounts.find((entry) => entry.email === target);
  if (!account) return null;
  const hash = await hashPassword(password, account.salt);
  return hash === account.passwordHash ? toPublicUser(account) : null;
}
