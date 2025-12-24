import { TableRow } from "./user-table-row";

export function UserTable({ users, onRowEdit }) {
  if (!users || users.length === 0) {
    return (
      <tr>
        <td colspan="9" className="text-center p-4">
          No users found.
        </td>
      </tr>
    );
  }

  return (
    <>
      <thead className="bg-white border-b border-gray-200 mt-4">
        <tr>
          <th className="th">
            <label className="check-container">
              <input id="select-all-checkbox" type="checkbox" />
              <span className="checkbox"></span>
            </label>
          </th>
          <th className="th">Profile</th>
          <th className="th">Full Name</th>
          <th className="th">Email Address</th>
          <th className="th">Phone Number</th>
          <th className="th">Role</th>
          <th className="th">status</th>
          <th className="th">Last Login</th>
          <th className="text-foreground h-10 px-2 align-middle font-medium whitespace-nowrap text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users?.map(({ id, status, name, email, role, phone, createdAt }) => {
          return (
            <TableRow
              id={id}
              key={id}
              name={name}
              role={role}
              email={email}
              phone={phone}
              status={status}
              createdAt={createdAt}
              onEdit={onRowEdit}
            />
          );
        })}
      </tbody>
    </>
  );
}
