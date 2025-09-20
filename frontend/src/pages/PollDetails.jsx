import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { votesAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [votes, setVotes] = useState([]);
  const [currentVote, setCurrentVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await votesAPI.getVotes();
      setVotes(response.data);
      const vote = response.data.find(v => v._id === id);
      setCurrentVote(vote);
    } catch (error) {
      setError('Failed to fetch poll data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!currentVote) return;
    
    setVoting(true);
    try {
      await votesAPI.voteForOption(currentVote._id);
      // Refresh votes after voting
      await fetchVotes();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleDeleteVote = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await votesAPI.deleteVote(currentVote._id);
        navigate('/dashboard');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete poll');
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

  if (!currentVote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
          <p className="text-gray-600 mb-4">The poll you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const hasVoted = user?.votedFor === currentVote._id;
  const canVote = !user?.votedFor && !hasVoted;

  // Prepare data for charts
  const chartData = votes.map(vote => ({
    name: vote.option,
    votes: vote.votes,
    id: vote._id
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">🏆 Election Results</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Poll Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentVote.option}
                </h2>
                <p className="text-gray-600">
                  Created by: {currentVote.createdBy?.email}
                </p>
                <p className="text-gray-600">
                  Created: {new Date(currentVote.createdAt).toLocaleDateString()}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={handleDeleteVote}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove Candidate
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {currentVote.votes}
              </div>
              <div className="text-gray-600">Total Votes</div>
            </div>

            {/* Voting Section */}
            <div className="border-t pt-6">
              {hasVoted ? (
                <div className="text-center">
                  <div className="text-green-600 text-lg font-medium mb-2">
                    ✓ You have voted for this option
                  </div>
                  <p className="text-gray-600">
                    Thank you for participating in this poll!
                  </p>
                </div>
              ) : user?.votedFor ? (
                <div className="text-center">
                  <div className="text-gray-600 text-lg font-medium mb-2">
                    You have already voted in another poll
                  </div>
                  <p className="text-gray-500">
                    Each user can only vote once across all polls.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-lg font-medium"
                  >
                    {voting ? 'Voting...' : 'Vote for this candidate/team'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vote Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vote Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* All Polls Summary */}
        {votes.length > 1 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Candidates/Teams Summary
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {votes.map((vote) => (
                <div
                  key={vote._id}
                  className={`p-4 rounded-lg border-2 ${
                    vote._id === currentVote._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium text-gray-900">{vote.option}</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {vote.votes}
                  </div>
                  <div className="text-sm text-gray-500">votes</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDetails;
