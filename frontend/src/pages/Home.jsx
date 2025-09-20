import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Hardcoded admin credentials (should match backend seed.js)
  const ADMIN_EMAIL = 'admin@college.edu';

  const handleUserDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleAdminDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.email === ADMIN_EMAIL) {
      navigate('/admin-dashboard');
    } else {
      // If not admin, redirect to user dashboard
      navigate('/user-dashboard');
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🏆 College Sports Election
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cast your vote for your favorite sports teams and athletes! 
            Real-time results, secure voting, and live updates during the election.
          </p>
          
          {/* Dashboard Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleUserDashboard}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Go to User Dashboard
            </button>
            <button
              onClick={handleAdminDashboard}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Go to Admin Dashboard
            </button>
          </div>

          {/* Original Login/Register Buttons */}
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg border-2 border-blue-600 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Voting</h3>
            <p className="text-gray-600">
              Simple and intuitive voting interface for college sports elections. 
              Vote for your favorite teams and athletes with just one click.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Election Results</h3>
            <p className="text-gray-600">
              Watch live election results as votes come in! Interactive charts 
              show real-time standings for your college sports teams.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair & Secure</h3>
            <p className="text-gray-600">
              Secure authentication and one-vote-per-user system ensures 
              fair and transparent college sports elections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
