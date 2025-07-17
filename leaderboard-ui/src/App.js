import React, { useState, useEffect } from 'react';
import UserDropdown from './components/UserDropdown';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import History from './components/History';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [topPerformers, setTopPerformers] = useState([]);
  const [loadingTopPerformers, setLoadingTopPerformers] = useState(true);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'claim', label: 'Claim Points', icon: '⚡' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'history', label: 'History', icon: '📈' }
  ];

  // Fetch top performers data
  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        setLoadingTopPerformers(true);
        const response = await fetch('http://localhost:5000/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort by totalPoints (descending) and take top 3
        const sortedUsers = data
          .filter(user => user.totalPoints !== undefined && user.totalPoints !== null)
          .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
          .slice(0, 3);
        
        setTopPerformers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top performers:', error);
        // Fallback to empty array on error
        setTopPerformers([]);
      } finally {
        setLoadingTopPerformers(false);
      }
    };

    fetchTopPerformers();
  }, []);

  const renderTopPerformers = () => {
    if (loadingTopPerformers) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((rank) => (
            <div key={rank} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (topPerformers.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="text-gray-400 mb-2">No data available</div>
          <div className="text-sm text-gray-500">Users with points will appear here</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {topPerformers.map((user, index) => {
          const rank = index + 1;
          return (
            <div key={user._id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                rank === 1 ? 'bg-yellow-500 text-black' : 
                rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-600 text-black'
              }`}>
                {rank}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">{user.name || 'Anonymous'}</div>
                <div className="text-gray-400 text-sm">{user.totalPoints || 0} points</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-blue-300/30 p-6 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setActiveSection('claim')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-blue-300 text-sm">Quick Action</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Claim Points</h3>
                <p className="text-gray-300 text-sm">Start earning points now</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl border border-purple-300/30 p-6 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setActiveSection('leaderboard')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Rankings</h3>
                <p className="text-gray-300 text-sm">See live leaderboard</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl border border-orange-300/30 p-6 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setActiveSection('history')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <span className="text-orange-300 text-sm">Analytics</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your Stats</h3>
                <p className="text-gray-300 text-sm">Track your progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Claim</h3>
                <div className="space-y-4">
                  <UserDropdown onSelect={setSelectedUser} />
                  {selectedUser && (
                    <div className="animate-slideIn">
                      <ClaimButton userId={selectedUser} onClaim={() => {}} />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Top Performers</h3>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Refresh data"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                {renderTopPerformers()}
              </div>
            </div>
          </div>
        );

      case 'claim':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Claim Your Points</h2>
              <p className="text-gray-400">Select a user and start earning points</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-white font-semibold mb-2">Select User</label>
                <UserDropdown onSelect={setSelectedUser} />
              </div>

              {selectedUser && (
                <div className="animate-slideIn space-y-4">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xl">✓</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">User Selected</div>
                        <div className="text-green-300 text-sm">Ready to claim points</div>
                      </div>
                    </div>
                  </div>
                  <ClaimButton userId={selectedUser} onClaim={() => {}} />
                </div>
              )}
            </div>
          </div>
        );

      case 'leaderboard':
        return (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Live Leaderboard</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Real-time updates</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">🏆</div>
                <div className="text-sm text-gray-400">Competition</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <Leaderboard />
            </div>
          </div>
        );

      case 'history':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <span className="text-4xl">📈</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Activity History</h2>
              <p className="text-gray-400">Track your performance and progress</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              {selectedUser ? (
                <History userId={selectedUser} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl opacity-60">👤</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No User Selected</h3>
                  <p className="text-gray-400 mb-4">Please select a user to view their history</p>
                  <button 
                    onClick={() => setActiveSection('claim')}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Select User
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <h1 className="text-xl font-bold text-white">Challenge Hub</h1>
          </div>
          <p className="text-gray-400 text-sm">Professional Dashboard</p>
        </div>

        <nav className="flex-1">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-300/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {selectedUser ? (typeof selectedUser === 'string' ? selectedUser : selectedUser.name || 'Selected') : '--'}
            </div>
            <div className="text-sm text-gray-400">Current User</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;