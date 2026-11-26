import { STAKEHOLDERS } from "../../data/sampleData";
import "./users.css";

function Users({ requests }) {
  return (
    <section className="content-card users-section">
      <div className="section-header">
        <div>
          <h2>System Stakeholders</h2>
          <p>Users submitting and managing feature requests</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Submitted Requests</th>
            </tr>
          </thead>
          <tbody>
            {STAKEHOLDERS.map((user) => (
              <tr key={user.name}>
                <td><strong>{user.name}</strong></td>
                <td>{user.role}</td>
                <td>{user.dept}</td>
                <td>{requests.filter((r) => r.requester?.includes(user.name.split(" ")[1])).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Users;
