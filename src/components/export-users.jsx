export function ExportUsers({ selectedIds, allUsers }) {
  function handleExport() {
    const ids = Object.keys(selectedIds);
    if (ids.length === 0) return alert("No users selected to export");
    const usersToExport = (allUsers || []).filter((u) => ids.includes(u.id));
    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "role",
      "status",
      "createdAt",
    ];
    const csv = [headers.join(",")]
      .concat(
        usersToExport.map((u) =>
          headers.map((h) => JSON.stringify(u[h] ?? "")).join(",")
        )
      )
      .join("\n");
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
  return (
    <>
      <button
        id="extract-btn"
        onClick={handleExport}
        className="flex w-44 sm:w-auto font-medium transition-all items-center justify-center gap-2 whitespace-nowrap shrink-0 h-9 px-4 py-2 has-[>svg]:px-3 rounded-md bg-black text-white hover:bg-black/90 disabled:pointer-events-none disabled:opacity-50 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([className*='size-'])]:size-4 sm:flex"
      >
        Export Users
      </button>
    </>
  );
}
