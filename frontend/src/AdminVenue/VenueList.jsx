/* eslint-disable react/prop-types */
import VenueCard from "./VenueCard";

const VenueList = ({
  venues,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  return (
    <div className="min-h-screen bg-cover bg-center p-5 lg:p-10 bg-customBg1">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-BgPinkMiddle hover:bg-BgPinkDark text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-BgFont font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-BgPinkMiddle hover:bg-BgPinkDark text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VenueList;
