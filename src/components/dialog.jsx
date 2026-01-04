import { useState } from "react";
export function DialogForm({
  title,
  isOpen,
  onClose,
  closeable = false,
  button,
  onSubmit,
  initialData,
}) {
  const [formState, setFormState] = useState({
    fullName: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "",
    status: initialData?.status !== undefined ? String(initialData.status) : "",
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formState,
      name: formState.fullName,
      status: formState.status === "true",
    };
    onSubmit(submittedData);
  };
  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="userModal"
      className="flex fixed inset-0 bg-black/50 justify-center items-center z-50"
      onClick={() => {
        closeable && onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => {
              onClose();
            }}
            type="button"
            id="closeFormBtn"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          id="userForm"
          className="space-y-4"
          action=""
        >
          <div>
            <label className="block text-sm mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              value={formState.fullName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px]"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px]"
              placeholder="yourEmail@example.com"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formState.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px]"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Role</label>
            <select
              name="role"
              required
              id="role"
              value={formState.role}
              onChange={handleChange}
              className="font-medium text-sm custom-select w-full border rounded-md px-3 py-2 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px]"
            >
              <option>Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Status</label>
            <select
              name="status"
              required
              id="status-in-modal"
              value={formState.status}
              onChange={handleChange}
              className="font-medium text-sm custom-select w-full border rounded-md px-3 py-2 outline-none focus-visible:border-[--ring] focus-visible:ring-[#a1a1a1]/50 focus-visible:ring-[3px]"
            >
              <option>Select a status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-between gap-4 mt-6">
            <button
              id="submit"
              type="submit"
              className="flex-1 bg-black text-white rounded-lg hover:bg-black/90 px-4 py-3"
            >
              {button}
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              id="cancelBtn"
              type="button"
              className="flex-1 bg-white font-medium text-black border border-black rounded-lg hover:border-black/70 px-4 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
