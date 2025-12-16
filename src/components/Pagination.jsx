export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 text-xs rounded-md border border-slate-300 disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 text-xs rounded-md border ${
            currentPage === p
              ? "bg-primary text-white border-primary"
              : "border-slate-300 text-slate-700"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 text-xs rounded-md border border-slate-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}