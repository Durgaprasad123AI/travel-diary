/**
 * components/ImageUpload.jsx — reusable image picker.
 * Uploads the chosen file to POST /api/upload and calls onChange(url).
 */
import { useRef, useState } from 'react';
import API from '../services/api';

const ImageUpload = ({ value, onChange, label = 'Image' }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError('');
    try {
      const { data } = await API.post('/upload', formData);
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  return (
    <div className="image-upload">
      {value ? (
        <img src={value} alt="preview" className="image-upload-preview" />
      ) : (
        <div className="image-upload-placeholder">📷</div>
      )}
      <div className="image-upload-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : value ? 'Change image' : `Choose ${label}`}
        </button>
        {value && (
          <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default ImageUpload;
