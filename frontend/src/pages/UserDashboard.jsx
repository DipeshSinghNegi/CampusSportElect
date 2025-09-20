import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { candidatesAPI } from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  // List of sport categories
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

  // Check if user has voted for a gender in a category
  const hasVotedInCategoryGender = (category, gender) => {
    return user?.votedCategories?.some(vote => vote.category === category && vote.gender === gender);
  };

  // Get voted candidate for a gender in a category
  const getVotedCandidateInCategoryGender = (category, gender) => {
    const vote = user?.votedCategories?.find(vote => vote.category === category && vote.gender === gender);
    return vote ? vote.candidate : null;
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
          <h1 className="text-3xl font-bold text-gray-900">🏆 Sports Election - User Dashboard</h1>
          <p className="mt-2 text-gray-600">
             {user?.username}! Cast your vote for each category. You can vote once per category.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Category Selection Screen */}
        {!selectedCategory ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sportCategories.map(category => (
              <div
                key={category}
                className="bg-white shadow rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition"
                onClick={() => setSelectedCategory(category)}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{category}</h2>
                <p className="text-gray-600">Click to view candidates</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <button
              className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </button>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory}</h2>
                {(hasVotedInCategoryGender(selectedCategory, 'Male') && hasVotedInCategoryGender(selectedCategory, 'Female')) ? (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">You have voted for both genders in this category</span>
                  </div>
                ) : (
                  <p className="text-gray-600">You can vote for one boy and one girl in this category.</p>
                )}
              </div>
              {/* Boys Candidates */}
              {groupedCandidates[selectedCategory]?.boys.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">Boys</span>
                    Male Candidates
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedCandidates[selectedCategory].boys.map((candidate) => {
                      const hasVoted = hasVotedInCategoryGender(selectedCategory, 'Male');
                      const isVotedCandidate = getVotedCandidateInCategoryGender(selectedCategory, 'Male') === candidate._id;
                      return (
                        <div 
                          key={candidate._id} 
                          className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                            isVotedCandidate 
                              ? 'border-green-500 bg-green-50' 
                              : hasVoted 
                                ? 'border-gray-200 bg-gray-50' 
                                : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-center">
                            <img
                              src={candidate.photo}
                              alt={candidate.name}
                              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
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
                            {isVotedCandidate ? (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                ✓ Your Vote
                              </div>
                            ) : hasVoted ? (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-xs font-medium cursor-not-allowed"
                              >
                                Already Voted for Boys
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVote(candidate._id)}
                                disabled={voting[candidate._id]}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                {voting[candidate._id] ? 'Voting...' : 'Vote'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Girls Candidates */}
              {groupedCandidates[selectedCategory]?.girls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm mr-2">Girls</span>
                    Female Candidates
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedCandidates[selectedCategory].girls.map((candidate) => {
                      const hasVoted = hasVotedInCategoryGender(selectedCategory, 'Female');
                      const isVotedCandidate = getVotedCandidateInCategoryGender(selectedCategory, 'Female') === candidate._id;
                      return (
                        <div 
                          key={candidate._id} 
                          className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                            isVotedCandidate 
                              ? 'border-green-500 bg-green-50' 
                              : hasVoted 
                                ? 'border-gray-200 bg-gray-50' 
                                : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-center">
                            <img
                              src={candidate.photo}
                              alt={candidate.name}
                              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
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
                            {isVotedCandidate ? (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                ✓ Your Vote
                              </div>
                            ) : hasVoted ? (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-xs font-medium cursor-not-allowed"
                              >
                                Already Voted for Girls
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVote(candidate._id)}
                                disabled={voting[candidate._id]}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                {voting[candidate._id] ? 'Voting...' : 'Vote'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Voting Summary */}
        {user?.votedCategories && user.votedCategories.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Voting Summary</h3>
            <div className="space-y-2">
              {user.votedCategories.map((vote, index) => {
                const candidate = candidates.find(c => c._id === vote.candidate);
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="font-medium text-gray-900">{vote.category}</span>
                      <span className="text-gray-600 ml-2">({vote.gender}) → {candidate?.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(vote.votedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
