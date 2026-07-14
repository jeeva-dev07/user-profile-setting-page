import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          style={{
            margin: "0 5px",
            fontWeight: currentPage === i + 1 ? "bold" : "normal",
          }}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <p>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
