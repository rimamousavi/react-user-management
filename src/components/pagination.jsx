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
          <select
            value={limit || "all"}
            onChange={handleLimitChange}
            name="pagination.limit"
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
