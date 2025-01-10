import { useState, useEffect } from 'react';
import VenueForm from './VenueForm';
import VenueList from './VenueList';
import { getVenues, addVenue, updateVenue, deleteVenue } from './venue';

const AdminVenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [editVenue, setEditVenue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const VENUES_PER_PAGE = 4; // Number of venues per page

  const totalPages = Math.ceil(venues.length / VENUES_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentVenues = venues.slice(
    (currentPage - 1) * VENUES_PER_PAGE,
    currentPage * VENUES_PER_PAGE
  );

  useEffect(() => {
    // Fetch venues when the page loads
    getVenues().then(setVenues);
  }, []);

  const handleAddVenue = (venueData) => {
    addVenue(venueData).then((newVenue) => {
      setVenues((prevVenues) => [...prevVenues, newVenue]); // Add new venue to the list
    });
  };

  const handleUpdateVenue = (venueData) => {
    updateVenue(editVenue._id, venueData).then((updatedVenue) => {
      setVenues((prevVenues) =>
        prevVenues.map((venue) =>
          venue._id === updatedVenue._id ? updatedVenue : venue
        )
      ); // Update the specific venue
      setEditVenue(null); // Reset form to Add mode
    });
  };

  const handleDeleteVenue = (venueId) => {
    deleteVenue(venueId).then(() => {
      setVenues((prevVenues) => prevVenues.filter((venue) => venue._id !== venueId)); // Remove the deleted venue
    });
  };

  return (
    <div className="container mx-auto">
      <VenueForm
        onSubmit={editVenue ? handleUpdateVenue : handleAddVenue}
        venue={editVenue}
        onCancel={() => setEditVenue(null)}
      />
      <VenueList
        venues={venues}
        onEdit={setEditVenue}
        onDelete={handleDeleteVenue}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminVenuePage;
