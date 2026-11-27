/**
 * routes/uploadRoutes.js
 * POST /api/upload — multipart/form-data with a field named "image".
 * Returns { url: "/uploads/<filename>" } on success.
 */
const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    uploadImage(req, res);
  });
});

module.exports = router;
