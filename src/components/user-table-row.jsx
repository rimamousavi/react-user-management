export function TableRow(props) {
  const {
    id,
    status,
    name,
    email,
    role,
    phone,
    createdAt,
    onEdit,
    onDelete,
    selectedUsers,
    onUserSelect,
  } = props;
  const isActive = status === true;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <tr key={id} className="hover:bg-gray-50 [&_tr:last-child]:border-0">
      <td data-label="Select" className="td">
        <label className="check-container">
          <input
            className="row-checkbox"
            type="checkbox"
            checked={!!selectedUsers?.[id]}
            onChange={(e) => onUserSelect?.(id, e.target.checked)}
          />
          <span className="checkbox"></span>
        </label>
      </td>
      <td data-label="Profile" className="text-left p-4 text-sm font-light td">
        <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full w-8 h-8">
          <span className="bg-[--muted] flex size-full items-center justify-center rounded-full">
            {initials}
          </span>
        </span>
      </td>
      <td data-label="Full Name" className="td font-medium">
        {name}
      </td>
      <td data-label="Email Address" className="td text-gray-600">
        {email}
      </td>
      <td data-label="Phone Number" className="td text-gray-600">
        {phone}
      </td>
      <td data-label="Role" className="td">
        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden border-transparent bg-[--primary] text-[--primary-foreground] [a&]:hover:bg-[--primary]/90">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </td>
      <td data-label="Status" className="td">
        <div className="flex items-center space-x-2">
          <label className="switch">
            <input
              data-id="{id}"
              data-name="{name}"
              className="switch-btn"
              type="checkbox"
              defaultChecked={isActive}
            />
            <span className="slider round"></span>
          </label>
          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px] dark:aria-invalid:ring-[--destructive]/40 transition-[color,box-shadow] overflow-hidden border-transparent bg-[--primary] text-[--primary-foreground] [a&]:hover:bg-[--primary]/90">
            {isActive ? "Active" : "inactive"}
          </span>
        </div>
      </td>
      <td data-label="Last Login" className="td text-gray-600">
        {createdAt.slice(0, 10) + " , " + createdAt.slice(11, 16)}
      </td>
      <td className="text-foreground h-10 px-2 align-middle font-medium whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit?.(props)}
            className="edit-btn inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px] aria-invalid:border-[--destructive] hover:bg-[--accent] hover:text-[--accent-foreground] dark:hover:bg-[--accent]/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="delete-btn inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px] hover:bg-[--accent] hover:text-[--accent-foreground] dark:hover:bg-[--accent]/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              color="red"
              viewBox="0 0 24 24"
            >
              <path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
