/**
 * pages/AddMemory.jsx — create (and edit) a diary memory.
 * Reuses MemoryForm; works for /memories/add and /memories/edit/:id.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import MemoryForm from '../components/MemoryForm';

const AddMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    let active = true;
    API.get(`/memories/${id}`)
      .then(({ data }) => active && setEditing(data))
      .catch(() => active && navigate('/memories'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <MemoryForm initialData={editing} onSaved={() => navigate('/memories')} />
    </div>
  );
};

export default AddMemory;
