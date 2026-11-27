/**
 * pages/AddTrip.jsx — wrapper page around TripForm.
 * Works for both /trips/add (create) and /trips/edit/:id (edit).
 */
import TripForm from '../components/TripForm';

const AddTrip = () => (
  <div className="page">
    <TripForm />
  </div>
);

export default AddTrip;
