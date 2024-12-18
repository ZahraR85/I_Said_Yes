/* eslint-disable react/prop-types */
/*import React from 'react';

const VenueCard = ({ venue }) => {
  return (
    <div className="card shadow-md p-4">
      <img src={venue.images[0]} alt={venue.name} className="h-48 w-full object-cover mb-2" />
      <h3 className="text-lg font-bold">{venue.name}</h3>
      <p className="text-sm text-gray-600">{venue.city}</p>
      <p className="text-sm">Capacity: {venue.capacity}</p>
      <p className="text-sm">Price: ${venue.price}</p>
    </div>
  );
};

export default VenueCard; */
import React from 'react';

const VenueCard = ({ venue, onEdit, onDelete, isAdmin, onViewDetails }) => {
  const { name, city, capacity, price, images } = venue;

  return (
    <div className="card bg-white shadow-lg p-4 rounded-md">
      <img
        src={images[0] || 'placeholder.jpg'}
        alt={name}
        className="h-48 w-full object-cover rounded-md"
      />
      <div className="mt-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm text-gray-600">{city}</p>
        <p className="text-sm text-gray-600">Capacity: {capacity}</p>
        <p className="text-sm text-gray-600">Price: ${price}</p>
      </div>
      <div className="mt-4 flex justify-between">
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(venue)}
              className="btn btn-primary text-white"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(venue._id)}
              className="btn btn-danger text-white"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewDetails(venue)}
            className="btn btn-secondary text-white"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueCard;

