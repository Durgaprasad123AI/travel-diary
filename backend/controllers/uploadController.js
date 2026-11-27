/**
 * controllers/uploadController.js
 * Accepts a single image upload and returns its public URL.
 * The multer middleware handles storage; this just responds.
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image was uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
};

module.exports = { uploadImage };
