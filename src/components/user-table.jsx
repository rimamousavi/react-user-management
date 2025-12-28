import { TableRow } from "./user-table-row";

export function UserTable({ users, onRowEdit, onRowDelete, selectedIds, onUserSelect }) {

     
  if (!users || users.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="9" className="text-center p-4">
            No users found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      
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
              onDelete={onRowDelete}
              selectedUsers={selectedIds}
              onUserSelect={onUserSelect}
            />
          );
        })}
      </tbody>
    </>
  );
}
