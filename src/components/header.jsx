import { ArrowUpNarrowWideIcon, FunnelIcon } from "lucide-react";
import { SelectOption } from "./select-option";
import { useUserContext } from "../context/user-context";

export function Header() {
  const service = useUserContext();

  const { filter, sort } = service.state;
  const { setFilter, setSort, setPage } = service.actions;

  const ROLE_OPTIONS = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  const STATUS_OPTIONS = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const SORT_OPTIONS = [
    { label: "Newest", value: "createdAt_desc" },
    { label: "Oldest", value: "createdAt_asc" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
  ];

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  }

  function handleSort(e) {
    const value = e.target.value;
    const [sortBy, order] = value.split("_");
    setSort({ sortBy, order });
    setPage(1);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 bg-white p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon size={16} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div id="roles-filter">
            <SelectOption
              value={filter.role}
              name="role"
              onChange={handleFilterChange}
              options={ROLE_OPTIONS}
            />
          </div>
          <div id="status-filter">
            <SelectOption
              value={filter.status}
              name="status"
              onChange={handleFilterChange}
              options={STATUS_OPTIONS}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ArrowUpNarrowWideIcon />
        <SelectOption
          value={sort.sortBy + "_" + sort.order}
          name="status"
          onChange={handleSort}
          options={SORT_OPTIONS}
          className="custom-select border-none focus:ring-0"
        />
      </div>
    </div>
  );
}
