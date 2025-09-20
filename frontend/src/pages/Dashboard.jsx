import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { candidatesAPI } from '../services/api';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState({});
  const { user } = useAuth();

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

  const handleVote = async (candidateId) => {
    setVoting({ ...voting, [candidateId]: true });
    try {
      await candidatesAPI.voteForCandidate(candidateId);
      // Refresh candidates after voting
      fetchCandidates();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to vote');
    } finally {
      setVoting({ ...voting, [candidateId]: false });
    }
  };

  const hasVotedForCandidate = (candidateId) => {
    return user?.votedCandidates?.some(vote => vote.candidate === candidateId);
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
          <h1 className="text-3xl font-bold text-gray-900">🏆 Sports Election Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.username}! Cast your vote for your favorite sports teams and athletes.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="mb-6">
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🔧 Admin Panel
            </Link>
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No candidates/teams available</div>
            {user?.role === 'admin' && (
              <p className="mt-2 text-gray-400">
                Use the Admin Panel to add your first candidate or team!
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {candidate.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {candidate.votes}
                    </div>
                    <div className="text-sm text-gray-500">votes</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/candidate/${candidate._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    
                    {hasVotedForCandidate(candidate._id) ? (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Voted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVote(candidate._id)}
                        disabled={voting[candidate._id]}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        {voting[candidate._id] ? 'Voting...' : 'Vote'}
                      </button>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    Created by: {candidate.createdBy?.username || candidate.createdBy?.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
