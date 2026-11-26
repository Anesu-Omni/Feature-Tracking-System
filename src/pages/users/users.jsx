import { useState } from "react";
import { readAccounts } from "../../context/authStorage";
import "./users.css";

function Users({ requests }) {
  const [accountState] = useState(() => {
    try {
      return { accounts: readAccounts(), error: "" };
    } catch (error) {
      return {
        accounts: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load registered users.",
      };
    }
  });

  return (
    <section className="content-card users-section">
      <div className="section-header">
        <div>
          <h2>Registered Users</h2>
          <p>Accounts registered with the Feature Tracking System</p>
        </div>
      </div>
      {accountState.error && (
        <p className="auth-alert auth-alert-error" role="alert">
          {accountState.error}
        </p>
      )}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Submitted Requests</th>
            </tr>
          </thead>
          <tbody>
            {accountState.accounts.length ? (
              accountState.accounts.map((user) => (
                <tr key={user.id || user.email}>
                  <td><strong>{user.fullName}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.department}</td>
                  <td>
                    {
                      requests.filter(
                        (request) =>
                          request.requester?.toLowerCase() ===
                          user.fullName.toLowerCase(),
                      ).length
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No registered users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Users;
