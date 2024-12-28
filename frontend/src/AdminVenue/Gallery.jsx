import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from "../context/AppContext";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [editingImageId, setEditingImageId] = useState(null);
  const { userId } = useAppContext();

  // Fetch images function (can be reused)
  const fetchImages = async () => {
    const response = await axios.get('http://localhost:3001/galleries');
    setImages(response.data);
  };

  // Fetch images when component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Add a new image
  const handleAddImage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        throw new Error('No token found in localStorage');
      }

      if (!userId) {
        console.error('No user ID found');
        alert('User ID is required to add an image');
        return;
      }

      await axios.post(
        'http://localhost:3001/galleries',
        { userId, imageName, imageUrl, description },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Image added successfully');
      fetchImages(); // Reload images after adding
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Failed to add image');
    }
  };

  // Handle updating an image
  const handleUpdateImage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        throw new Error('No token found in localStorage');
      }

      if (!userId) {
        console.error('No user ID found');
        alert('User ID is required to update an image');
        return;
      }

      await axios.put(
        `http://localhost:3001/galleries/${editingImageId}`,
        { userId, imageName, imageUrl, description },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Image updated successfully');
      fetchImages(); // Reload images after updating
      setEditingImageId(null); // Clear editing state
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image');
    }
  };

  // Handle deleting an image
  const handleDeleteImage = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3001/galleries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchImages(); // Reload images after deleting
  };

  // Set the current image for editing
  const handleEditClick = (image) => {
    setEditingImageId(image._id);
    setImageName(image.imageName);
    setImageUrl(image.imageUrl);
    setDescription(image.description);
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
    <div className="relative min-h-screen bg-cover bg-center p-20  bg-[url('https://i.postimg.cc/qMRwT2zF/gallery3.jpg')]">
    {/* Overlay for controlling opacity */}
    <div className="absolute inset-0 bg-white/50 "></div>
    <div className="relative mx-auto w-full max-w-[calc(45%-100px)] bg-opacity-80 shadow-md rounded-lg p-5 mt-40 space-y-4">
        <h2 className="text-xl font-bold text-BgFont mb-12 text-center">Add / Edit Images in Gallery</h2>
        <input
          type="text"
          placeholder="Image Name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          className="w-full mb-4 p-2 border border-BgKhaki rounded focus:outline-none focus:ring focus:ring-BgKhaki"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mb-4 p-2 border border-BgKhaki rounded focus:outline-none focus:ring focus:ring-BgKhaki"
        />
        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border border-BgKhaki rounded focus:outline-none focus:ring focus:ring-BgKhaki"
        />
        {editingImageId ? (
          <button
            onClick={handleUpdateImage}
            className="w-full bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark hover:text-xl p-4 rounded "
          >
            Update Image
          </button>
        ) : (
          <button
            onClick={handleAddImage}
            className="w-full bg-BgPinkMiddle text-BgFont font-bold hover:bg-BgPinkDark hover:text-xl p-4 rounded "
          >
            Add Image
          </button>
        )}
      </div>
      </div>
      <div className="w-full p-6 bg-customBg1 shadow-lg rounded-lg space-y-5 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ">
        {images.map((image) => (
          <div
            key={image._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-primary transition-all duration-300 ease-out"
          >
            <img src={image.imageUrl} alt={image.description} className="w-full h-48 object-cover" />
            <div className="p-4">
            <p className="text-BgFont font-bold">{image.imageName}</p>
              <p className="text-BgFont">{image.description}</p>
              <button
                onClick={() => handleEditClick(image)}
                className="mt-4 px-4 py-2 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteImage(image._id)}
                className="mt-4 ml-2 px-4 py-2 bg-BgPinkMiddle text-BgFont font-bold rounded hover:bg-BgPinkDark"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Gallery;
