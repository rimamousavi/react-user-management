import { useState, useRef, useEffect } from "react";
import { DialogForm, UserTable, ExportUsers, Header } from "./components";
import { useToggle } from "@uidotdev/usehooks";
import { useUserService } from "./hooks/api";
import { useDebounceValue } from "usehooks-ts";
import Loader from "./components/loader";

function App() {
  const [on, toggle] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState({});
  const selectAllRef = useRef(null);
  const userService = useUserService();
  const { users, allUsers, isLoading, total } = userService.data;
  const { filter, pagination } = userService.state;
  const { setFilter, setPage, create, update, remove, refresh } =
    userService.actions;
  const [searchTerm, setSearchTerm] = useState(filter.search || "");
  const [debouncedSearch] = useDebounceValue(searchTerm, 800);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (debouncedSearch !== filter.search) {
      setFilter((prev) => ({ ...prev, search: debouncedSearch }));
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    const selectedCount = Object.keys(selectedIds).length;
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < total;
    selectAllRef.current.checked = selectedCount === total && total > 0;
  }, [selectedIds, total]);

  function handleUserSelect(id, checked) {
    setSelectedIds((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  }

  const totalPage = pagination.limit ? Math.ceil(total / pagination.limit) : 1;
  const handleFormSubmit = (formData) => {
    if (selectedUser) {
      update({ id: selectedUser.id, ...formData }, () => {
        toggle(false);
        setSelectedUser(null);
        setPage(totalPage);
      });
    } else {
      create(formData, () => {
        toggle(false);
        setPage(totalPage);
        refresh;
      });
    }
  };

  return (
    <>
      <main className="bg-[#f7f9fa] font-sans overflow-y-auto">
        <div className="max-w-full flex-1 p-4 lg:p-6">
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
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                <ExportUsers selectedIds={selectedIds} allUsers={allUsers} />
              </div>
            </div>
          </div>
          <Header />
          <div className="flex flex-col-reverse overflow-x-auto border border-gray-200 bg-white rounded-lg mt-4">
            <table>
              <Loader isLoading={isLoading}>
                <UserTable
                  selectAllRef={selectAllRef}
                  allUsers={allUsers}
                  setSelectedIds={setSelectedIds}
                  users={users}
                  selectedIds={selectedIds}
                  onUserSelect={handleUserSelect}
                  onRowEdit={(user) => {
                    setSelectedUser(user);
                    toggle(true);
                  }}
                  total={total}
                  onRowDelete={(id) => remove(id)}
                />
              </Loader>
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
