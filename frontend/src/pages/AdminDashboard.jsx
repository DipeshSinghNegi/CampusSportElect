import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRandomAvatar } from '../utils/defaultAvatars';
import { candidatesAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    sportCategory: '',
    photo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const sportCategories = [
    "Volleyball Secretary Boys",
    "Volleyball Secretary Girls", 
    "Cricket Secretary",
    "Indoor Games Secretary",
    "Overall Sports Secretary"
  ];

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
      let candidateData = { ...formData };
      if (!candidateData.photo) {
        candidateData.photo = getRandomAvatar();
      }
      await candidatesAPI.createCandidate(candidateData);
      setFormData({ name: '', gender: '', sportCategory: '', photo: '' });
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

  // Group candidates by category and then by gender
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.sportCategory]) {
      acc[candidate.sportCategory] = {
        boys: [],
        girls: []
      };
    }
    
    if (candidate.gender === 'Male') {
      acc[candidate.sportCategory].boys.push(candidate);
    } else {
      acc[candidate.sportCategory].girls.push(candidate);
    }
    
    return acc;
  }, {});

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
          <h1 className="text-3xl font-bold text-gray-900">🔧 Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage candidates for the college sports election. Add, edit, or delete candidates by category.
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
            {showAddForm ? 'Cancel' : '+ Add New Candidate'}
          </button>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Candidate
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Enter candidate name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="sportCategory" className="block text-sm font-medium text-gray-700">
                  Sport Category
                </label>
                <select
                  name="sportCategory"
                  id="sportCategory"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sportCategory}
                  onChange={handleInputChange}
                >
                  <option value="">Select Sport Category</option>
                  {sportCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  name="photo"
                  id="photo"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photo}
                  onChange={handleInputChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to use default placeholder photo
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

        {/* Candidates by Category */}
        {Object.keys(groupedCandidates).length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">No candidates found</div>
            <p className="mt-2 text-gray-400">Add your first candidate to get started!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedCandidates).map(([category, { boys, girls }]) => (
              <div key={category} className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{category}</h2>
                  <p className="text-gray-600">
                    {boys.length + girls.length} candidate{(boys.length + girls.length) !== 1 ? 's' : ''} 
                    ({boys.length} boys, {girls.length} girls)
                  </p>
                </div>
                
                {/* Boys Candidates */}
                {boys.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">Boys</span>
                      Male Candidates ({boys.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {boys.map((candidate) => (
                        <div key={candidate._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="text-center">
                            <img
                              src={candidate.photo}
                              alt={candidate.name}
                              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                            />
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {candidate.name}
                            </h4>
                            <div className="mb-3">
                              <div className="text-xl font-bold text-blue-600">
                                {candidate.votes}
                              </div>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                            <button
                              onClick={() => handleDelete(candidate._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Girls Candidates */}
                {girls.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm mr-2">Girls</span>
                      Female Candidates ({girls.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {girls.map((candidate) => (
                        <div key={candidate._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="text-center">
                            <img
                              src={candidate.photo}
                              alt={candidate.name}
                              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                            />
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {candidate.name}
                            </h4>
                            <div className="mb-3">
                              <div className="text-xl font-bold text-blue-600">
                                {candidate.votes}
                              </div>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                            <button
                              onClick={() => handleDelete(candidate._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
