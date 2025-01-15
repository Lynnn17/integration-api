const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-600 text-white text-gray-700 rounded-md mr-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
        "
      >
        Previous
      </button>
      <span className="px-4 py-2  dark:text-white text-gray-800 ">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-600 text-white rounded-md ml-2
         disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
