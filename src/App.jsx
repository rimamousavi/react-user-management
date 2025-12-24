import { useState } from "react";
import { DialogForm, UserTable } from "./components";

import useSWR from "swr";
import axios from "axios";
import { useToggle } from "@uidotdev/usehooks";

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
axios.defaults.baseURL = "https://693e775f12c964ee6b6d71d4.mockapi.io/api/v1";
function App() {
  const API_URL = "/users";

  function handleOnChange(e) {
    setFilter((prve) => ({ ...prve, search: e.target.value }));
  }
  const [on, toggle] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState({ role: "", status: "", search: "" });
  const [sort, setSort] = useState({ sortBy: "", order: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: users, isLoading } = useSWR(
    [API_URL, filter, sort, page, limit],
    ([url, filter, sort, page, limit]) => {
      const allParams = { ...filter, ...sort, page, limit };

      const cleanedParams = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(allParams).filter(([_, v]) => v !== "")
      );

      return axios.get(url, {
        params: cleanedParams,
      });
    }
  );
  const { data: allUsers } = useSWR(
    [API_URL, filter, sort],
    ([url, filter, sort]) => {
      const allParams = { ...filter, ...sort };

      const cleanedParams = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(allParams).filter(([_, v]) => v !== "")
      );

      return axios.get(url, {
        params: cleanedParams,
      });
    }
  );

  const totalUser = allUsers?.data?.length || 0;
  const totalPage = Math.ceil(totalUser / limit);
  const start = (page - 1) * limit + 1 || 1;
  const end = Math.min(start + limit - 1, totalUser) || totalUser;
  function handleSort(e) {
    const value = e.target.value;
    const [sortBy, order] = value.split("_");
    setSort({ sortBy, order });
  }

  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
            <div>
              <h3 className="font-medium">User Management</h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input
                  // value={filter.search}
                  onChange={debounce(handleOnChange, 800)}
                  type="search"
                  name="search"
                  id="search"
                  className="placeholder:text-[--muted-foreground] selection:bg-[--primary-foreground] selection:text-[--foreground] dark:bg-[--input]/30 border-[--input] flex h-9 min-w-0 rounded-md border px-3 py-1 text-base bg-[--input-background] transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px] pl-10 w-full sm:w-64"
                  placeholder="Search user..."
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    toggle(true);
                  }}
                  id="openFormBtn"
                  className="flex w-44 sm:w-auto transition-all items-center justify-center gap-2 whitespace-nowrap shrink-0 h-9 px-4 py-2 has-[>svg]:px-3 rounded-md bg-black text-white hover:bg-black/90 disabled:pointer-events-none disabled:opacity-50 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([className*='size-'])]:size-4 sm:flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-plus w-4 h-4 mr-2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  Add User
                </button>

                <button
                  id="extract-btn"
                  className="flex w-44 sm:w-auto font-medium transition-all items-center justify-center gap-2 whitespace-nowrap shrink-0 h-9 px-4 py-2 has-[>svg]:px-3 rounded-md bg-black text-white hover:bg-black/90 disabled:pointer-events-none disabled:opacity-50 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([className*='size-'])]:size-4 sm:flex"
                >
                  Export Users
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 bg-white p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-gray-500"
                >
                  <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
                </svg>
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div id="roles-filter">
                  <select
                    value={filter.role}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, role: e.target.value }))
                    }
                    id="roles"
                    className="custom-select"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div id="status-filter">
                  <select
                    value={filter.status}
                    onChange={(e) =>
                      setFilter((prve) => ({ ...prve, status: e.target.value }))
                    }
                    id="status"
                    className="custom-select"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500"
              >
                <path d="m3 8 4-4 4 4"></path>
                <path d="M7 4v16"></path>
                <path d="M11 12h4"></path>
                <path d="M11 16h7"></path>
                <path d="M11 20h10"></path>
              </svg>
              <select
                value={sort.sortBy + "_" + sort.order}
                onChange={handleSort}
                name="sort"
                id="sort"
                className="custom-select border-none focus:ring-0"
              >
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col-reverse overflow-x-auto border border-gray-200 bg-white rounded-lg mt-4">
            <table>
              <UserTable
                users={users?.data}
                onRowEdit={(id) => {
                  setSelectedUser(id);
                  toggle(true);
                }}
              />
              <tfoot className="border-t">
                <tr>
                  <td colSpan="9" className="sm:p-4 h-full w-full">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p
                          id="pagination-summary"
                          className="text-sm text-gray-600"
                        >
                          Showing {totalUser > 0 ? start : 0} – {end} of{" "}
                          {totalUser} users
                        </p>
                      </div>
                      <div className="flex flex-row space-x-2 gap-4 flex-wrap-reverse">
                        <div id="per-page">
                          <select
                            value={limit}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLimit(value === "all" ? null : Number(value));
                            }}
                            name="limit"
                            id="per"
                            className="custom-select w-auto"
                          >
                            <option value="5">5 Items per page</option>
                            <option value="10">10 Items per page</option>
                            <option value="15">15 Items per page</option>
                            <option value="50">50 Items per page</option>
                            <option value="100">100 Items per page</option>
                            <option value="all">All items</option>
                          </select>
                        </div>
                        <div className="flex flex-row justify-between ">
                          <button
                            id="prev-btn"
                            className="pagination-button"
                            onClick={() => setPage((prev) => prev - 1)}
                            disabled={page === 1}
                          >
                            Previous
                          </button>
                          <div
                            id="page-buttons-container"
                            className="flex items-center space-x-2 px-2"
                          >
                            {page}
                          </div>
                          <button
                            disabled={page === totalPage}
                            onClick={() => setPage((prev) => prev + 1)}
                            id="next-btn"
                            className="pagination-button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
      <DialogForm
        isOpen={on}
        onClose={() => toggle(false)}
        title={selectedUser ? " Update" : "add user"}
        button={selectedUser ? "Update User" : "add user"}
      />
    </>
  );
}

export default App;
