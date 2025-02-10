import Gallery from '../models/Gallery.js';
import path from 'path';

// Get all gallery images
export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().populate('userId', 'name');
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new image to the gallery
export const addGalleryImage = async (req, res) => {
  const { userId, imageName, description, category } = req.body;

  if (!imageName || !category || !userId || !req.file) {
    return res.status(400).json({ error: 'Missing required fields or image file' });
  }

  try {
   // const imagePath = req.file.path.replace(/\\/g, '/'); // Ensure forward slashes
    //console.log('Saving image path:', imagePath); // Log the image path

    const newImage = new Gallery({
      userId: userId,
      imageName,
      imagePath: req.cloudinaryURL,
      description,
      category,
    });
    
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an image from the gallery
export const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const deletedImage = await Gallery.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a gallery image
export const updateGalleryImage = async (req, res) => {
  const { id } = req.params;
  const { userId, imageName, description, category, keepExistingImage } = req.body;

  const updateData = { userId, imageName, description, category };

  if (keepExistingImage !== 'true' && req.file) {
    updateData.imagePath = req.cloudinaryURL
  }

  try {
    const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send('Error updating image');
  }
};

// Route to get photos by category
export const GalleryCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const photos = await Gallery.find({ category });
    //console.log('Photos for category:', photos); // Debugging
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

