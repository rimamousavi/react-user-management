import { TableRow } from "./user-table-row";
import { Pagination } from "./pagination";
import { useUserContext } from "../context/user-context";

export function UserTable({
  users,
  onRowEdit,
  onRowDelete,
  selectedIds,
  onUserSelect,
  selectAllRef,
  allUsers,
  setSelectedIds,
  total,
}) {
  const service = useUserContext();

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

  const { pagination } = service.state;
  const { setPage, setLimit } = service.actions;

  function handleSelectAll(checked) {
    if (checked) {
      const all = {};

      (allUsers || []).forEach((u) => {
        all[u.id] = true;
      });
      setSelectedIds(all);
    } else {
      setSelectedIds({});
    }
  }

  return (
    <>
      <thead className="bg-white border-b border-gray-200 mt-4">
        <tr>
          <th className="th">
            <label className="check-container">
              <input
                id="select-all-checkbox"
                ref={selectAllRef}
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
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
              onDelete={onRowDelete}
              selectedUsers={selectedIds}
              onUserSelect={onUserSelect}
            />
          );
        })}
      </tbody>
      <tfoot className="border-t">
        <tr>
          <td colSpan="9" className="sm:p-4 h-full w-full">
            <Pagination
              total={total}
              page={pagination.page}
              limit={pagination.limit}
              onPageChange={(e) => setPage(e)}
              onLimitChange={(e) => {
                setLimit(e);
                setPage(1);
              }}
            />
          </td>
        </tr>
      </tfoot>
    </>
  );
}
