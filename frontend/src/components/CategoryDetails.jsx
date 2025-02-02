import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryDetails = () => {
  const { category } = useParams(); // Get category from the URL
  const [photos, setPhotos] = useState([]); // Store photos
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Track selected photo for detailed view
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    // Fetch photos by category
    const fetchCategoryPhotos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/galleries/category/${category}` // Backend endpoint
        );
        setPhotos(response.data); // Update photos state
      } catch (error) {
        console.error("Error fetching category photos:", error);
      }
    };

    fetchCategoryPhotos();
  }, [category]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPhotos = photos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(photos.length / itemsPerPage);

  // Handle photo click
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  // Handle return to grid view
  const handleBackToGrid = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="container mx-auto my-8 text-center">
      <h1 className="text-2xl font-bold text-BgFont mb-4">{category} Photos</h1>

      {selectedPhoto ? (
        // Single photo view
        <div>
          <div className="flex justify-center mb-6">
            <img
              src={`${selectedPhoto.imagePath}`}
              alt={selectedPhoto.imageName}
              className="w-[90%] h-112 object-cover rounded"
            />
          </div>
          <button
            onClick={handleBackToGrid}
            className="px-4 py-2 bg-BgPinkMiddle text-BgFont text-xl font-bold rounded hover:bg-BgPinkDark"
          >
            Back to Grid
          </button>
        </div>
      ) : (
        // Grid view
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPhotos.length > 0 ? (
              currentPhotos.map((photo) => (
                <img
                  key={photo._id}
                  src={`${photo.imagePath}`}
                  alt={photo.imageName}
                  onClick={() => handlePhotoClick(photo)}
                  className="w-full h-72 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No photos found for this category.
              </p>
            )}
          </div>
          <div className="flex justify-center items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="lg:px-4 lg:py-2 px-2 py-1 lg:font-bold font-semibold text-sm lg:text-m text-BgFont bg-BgPinkMiddle rounded hover:bg-BgPinkDark "
            >
              Previous
            </button>
            <span className="lg:px-4 lg:py-2 px-2 py-1 text-sm lg:text-m mx-2 text-BgFont">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="lg:px-4 lg:py-2 px-2 py-1 lg:font-bold font-semibold text-sm lg:text-m text-BgFont bg-BgPinkMiddle rounded hover:bg-BgPinkDark "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
