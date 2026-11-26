# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Sign-in CAPTCHA

Sign-in uses a custom canvas CAPTCHA with randomly generated characters and a refresh control. No CAPTCHA package or paid service is required.

The text is checked in the browser before requesting an OTP. This client-side check can be bypassed and is not sufficient protection against automated abuse; production authentication should generate and validate CAPTCHA challenges on the server.

## Demo authentication

In development, demo accounts are stored in browser local storage under `fts.auth.accounts`; clear them with `localStorage.removeItem("fts.auth.accounts")` in the browser console. The first demo sign-in seeds these credentials:

| Role | Email | Password |
| --- | --- | --- |
| Project Manager | `project.manager@omnicontact.biz` | `FtS-Manager-2026!` |
| Supervisor | `eunice.chikondo@omnicontact.biz` | `FtS-Supervisor-2026!` |
| Project Leader | `anesu@econet.co.zw` | `FtS-Leader-2026!` |
| Developer | `developer.demo@econet.co.zw` | `FtS-Developer-2026!` |

New demo registrations are checked against the synthetic employee roster in `src/data/demoCompanyDirectory.js` and limited to the Developers of Projects department. These credentials and roster entries are test data and must be replaced with company-directory and authentication APIs before real use. Only `@omnicontact.biz` and `@econet.co.zw` email addresses are accepted. Phone and OTP are optional. This client-side store is for demonstration only; production authentication and department enforcement must happen on a trusted server.
