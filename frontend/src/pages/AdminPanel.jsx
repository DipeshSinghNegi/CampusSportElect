import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { candidatesAPI } from '../services/api';

const AdminPanel = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await candidatesAPI.getCandidates();
      setCandidates(response.data);
    } catch (error) {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await candidatesAPI.createCandidate(formData);
      setFormData({ name: '', description: '', image: '' });
      setShowAddForm(false);
      fetchCandidates(); // Refresh the list
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create candidate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidatesAPI.deleteCandidate(id);
        fetchCandidates(); // Refresh the list
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete candidate');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔧 Admin Panel</h1>
          <p className="mt-2 text-gray-600">
            Manage candidates and teams for the college sports election.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Add Candidate Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Add New Candidate/Team'}
          </button>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Candidate/Team
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter candidate/team name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description of the candidate/team"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to use default placeholder image
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md"
                >
                  {submitting ? 'Adding...' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidates List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Candidates/Teams ({candidates.length})
            </h2>
          </div>
          <div className="p-6">
            {candidates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">No candidates found</div>
                <p className="mt-2 text-gray-400">Add your first candidate to get started!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => (
                  <div key={candidate._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {candidate.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {candidate.votes} votes
                      </div>
                      <button
                        onClick={() => handleDelete(candidate._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
