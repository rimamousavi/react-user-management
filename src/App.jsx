import { useState, useRef, useEffect } from "react";
import { DialogForm, UserTable } from "./components";
import useSWR from "swr";
import axios from "axios";
import { useToggle } from "@uidotdev/usehooks";
import useSWRMutation from "swr/mutation";

axios.defaults.baseURL = "https://693e775f12c964ee6b6d71d4.mockapi.io/api/v1";
const API_URL = "/users";

const addUserFetcher = async (url, { arg }) => {
  try {
    await axios.post(url, arg);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const updateUserFetcher = async (url, { arg }) => {
  const { id, ...data } = arg;
  try {
    await axios.put(`${url}/${id}`, data);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUserFetcher = async (url, { arg: id }) => {
  try {
    await axios.delete(`${url}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function App() {
  const [on, toggle] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState({ role: "", status: "", search: "" });
  const [sort, setSort] = useState({ sortBy: "", order: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const {
    data: users,
    isLoading,
    mutate,
  } = useSWR(
    [API_URL, filter, sort, page, limit],
    ([url, filter, sort, page, limit]) => {
      const allParams = { ...filter, ...sort, page, limit };
      if (limit === "all" || limit === null) {
        delete allParams.page;
        delete allParams.limit;
      }
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
  const { trigger: addUserTrigger } = useSWRMutation(API_URL, addUserFetcher);
  const { trigger: deleteUserTrigger } = useSWRMutation(
    API_URL,
    deleteUserFetcher
  );
  const { trigger: updateUserTrigger } = useSWRMutation(
    API_URL,
    updateUserFetcher
  );

  const totalUser = allUsers?.data?.length || 0;
  const [selectedIds, setSelectedIds] = useState({});
  const selectAllRef = useRef(null);

  useEffect(() => {
    const selectedCount = Object.keys(selectedIds).length;
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < totalUser;
    selectAllRef.current.checked = selectedCount === totalUser && totalUser > 0;
  }, [selectedIds, totalUser]);

  function handleUserSelect(id, checked) {
    setSelectedIds((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  }

  function handleSelectAll(checked) {
    if (checked) {
      const all = {};
      (allUsers?.data || []).forEach((u) => {
        all[u.id] = true;
      });
      setSelectedIds(all);
    } else {
      setSelectedIds({});
    }
  }

  function handleExport() {
    const ids = Object.keys(selectedIds);
    if (ids.length === 0) return alert("No users selected to export");
    const usersToExport = (allUsers?.data || []).filter((u) => ids.includes(u.id));
    const headers = ["id", "name", "email", "phone", "role", "status", "createdAt"];
    const csv = [headers.join(",")].concat(
      usersToExport.map((u) =>
        headers.map((h) => JSON.stringify(u[h] ?? "")).join(",")
      )
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-users.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const totalPage = limit ? Math.ceil(totalUser / limit) : 1;
  const start = (page - 1) * limit + 1 || 1;
  const end = Math.min(start + limit - 1, totalUser) || totalUser;
  const handleFormSubmit = (formData) => {
    if (selectedUser) {
      handleUserUpdate({ id: selectedUser.id, ...formData });
    } else {
      handleUserAdd(formData);
    }
  };
  function handleSearch(e) {
    setFilter((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  }
  function handleRole(e) {
    setFilter((prev) => ({ ...prev, role: e.target.value }));
    setPage(1);
  }
  function handleStatus(e) {
    setFilter((prev) => ({ ...prev, status: e.target.value }));
    setPage(1);
  }
  function handleSort(e) {
    const value = e.target.value;
    const [sortBy, order] = value.split("_");
    setSort({ sortBy, order });
    setPage(1);
  }
  function handleUserAdd(formData) {
    addUserTrigger(formData, {
      onSuccess: () => {
        toggle(false);
        mutate();
      },
    });
  }
  function handleUserUpdate(dataWithId) {
    updateUserTrigger(dataWithId, {
      onSuccess: () => {
        toggle(false);
        setSelectedUser(null);
        mutate();
      },
    });
  }
  function handleUserDelete(id) {
    deleteUserTrigger(id, {
      onSuccess: () => {
        mutate();
      },
    });
  }



  if (isLoading) return <div>loading...</div>;

  console.log("selectedUser", selectedUser);

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
                  onChange={debounce(handleSearch, 800)}
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
                  onClick={handleExport}
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
                    onChange={handleRole}
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
                    onChange={handleStatus}
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
              <UserTable
                users={users?.data}
                selectedIds={selectedIds}
                onUserSelect={handleUserSelect}
                onRowEdit={(user) => {
                  setSelectedUser(user);
                  toggle(true);
                }}
                onRowDelete={handleUserDelete}
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
                            {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                              (p) => (
                                <button
                                  key={p}
                                  data-page={p}
                                  onClick={() => setPage(p)}
                                  className={`pagination-button page-number-btn ${p === page ? "bg-gray-200" : ""}`}
                                >
                                  {p}
                                </button>
                              )
                            )}
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
        key={selectedUser ? selectedUser : "add-mode"}
        isOpen={on}
        initialData={selectedUser}
        onSubmit={handleFormSubmit}
        onClose={() => {
          toggle(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Update User" : "Add User"}
        button={selectedUser ? "Update User" : "Add User"}
      />
    </>
  );
}

export default App;
