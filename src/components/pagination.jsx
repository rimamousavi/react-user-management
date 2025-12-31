import { SelectOption } from "./select-option";

export function Pagination({
  total = 0,
  page = 1,
  limit = 5,
  onPageChange,
  onLimitChange,
}) {
  const totalPage = limit ? Math.ceil(total / limit) : 1;
  const start = (page - 1) * limit + 1 || 1;
  const end = Math.min(start + limit - 1, total) || total;
  const PERPAGE_OPTIONS = [
    { value: "5", label: "5 Items per page" },
    { value: "10", label: "10 Items per page" },
    { value: "15", label: "15 Items per page" },
    { value: "50", label: "50 Items per page" },
    { value: "100", label: "100 Items per page" },
    { value: "all", label: "All items" },
  ];
  const handleLimitChange = (e) => {
    const val = e.target.value;
    const newLimit = val === "all" ? null : Number(val);
    onLimitChange(newLimit);
  };

  console.log(total, page, limit, "Pagination");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
      <div className="flex items-center space-x-2">
        <p id="pagination-summary" className="text-sm text-gray-600">
          Showing {total > 0 ? start : 0} – {end} of {total} users
        </p>
      </div>
      <div className="flex flex-row space-x-2 gap-4 flex-wrap-reverse">
        <div id="per-page">
          <SelectOption
            value={limit || "all"}
            onChange={handleLimitChange}
            name="pagination.limit"
            className="w-auto"
            options={PERPAGE_OPTIONS}
          />
        </div>
        <div className="flex flex-row justify-between ">
          <button
            id="prev-btn"
            className="pagination-button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <div
            id="page-buttons-container"
            className="flex items-center space-x-2 px-2"
          >
            {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                data-page={p}
                onClick={() => onPageChange(p)}
                className={`pagination-button page-number-btn ${
                  p === page ? "bg-gray-200" : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={page === totalPage}
            onClick={() => onPageChange(page + 1)}
            id="next-btn"
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
