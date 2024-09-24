import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination ({ currentPage, totalPages, onPageChange }:PaginationProps){
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const firstPages = [1, 2];
    const lastPages = [totalPages - 1, totalPages];

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === i ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'}`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show the first, current, and last few pages
      firstPages.forEach(page => {
        if (page <= totalPages) {
          pageNumbers.push(
            <button
              key={page}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === page ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          );
        }
      });

      if (currentPage > 3) {
        pageNumbers.push(<span key="left-ellipsis">...</span>);
      }

      if (currentPage > 2 && currentPage < totalPages - 1) {
        pageNumbers.push(
          <button
            key={currentPage}
            className={`mx-1 px-3 py-1 border rounded ${'bg-indigo-500 text-white'}`}
            onClick={() => handlePageClick(currentPage)}
          >
            {currentPage}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(<span key="right-ellipsis">...</span>);
      }

      lastPages.forEach(page => {
        if (page > 0 && page !== firstPages[0] && page !== firstPages[1]) {
          pageNumbers.push(
            <button
              key={page}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === page ? 'bg-purple-500 text-white' : 'bg-white text-purple-500'}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          );
        }
      });
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        className="mx-1 px-3 py-1 border rounded bg-white text-indigo-500"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {renderPageNumbers()}
      <button
        className="mx-1 px-3 py-1 border rounded bg-white text-indigo-500"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;