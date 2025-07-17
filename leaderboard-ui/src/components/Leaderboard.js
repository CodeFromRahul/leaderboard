import React, { useEffect, useState, useCallback } from 'react';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort users by points in descending order
      const sortedUsers = data.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      
      setUsers(sortedUsers);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // Update every 5 seconds for better performance
    
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <span className="w-5 h-5 text-yellow-500 flex items-center justify-center">🏆</span>;
      case 1:
        return <span className="w-5 h-5 text-gray-400 flex items-center justify-center">🥈</span>;
      case 2:
        return <span className="w-5 h-5 text-amber-600 flex items-center justify-center">🥉</span>;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-medium text-gray-400">#{index + 1}</div>;
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 1:
        return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30";
      case 2:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70";
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 text-yellow-500 flex items-center justify-center text-2xl">🏆</span>
                <h1 className="text-2xl font-bold">Live Leaderboard</h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Loading...</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-slate-600 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-600 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-slate-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 text-yellow-500 flex items-center justify-center text-2xl">🏆</span>
                <h1 className="text-2xl font-bold">Live Leaderboard</h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Connection Error</span>
              </div>
            </div>
            
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-red-300">Unable to load leaderboard</h3>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                  <button 
                    onClick={fetchUsers}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 text-yellow-500 flex items-center justify-center text-2xl">🏆</span>
              <h1 className="text-2xl font-bold">Live Leaderboard</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time updates</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-blue-400 flex items-center justify-center">👥</span>
                <span className="text-sm text-gray-400">Total Players</span>
              </div>
              <div className="text-xl font-bold text-blue-400">{users.length}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-green-400 flex items-center justify-center">📈</span>
                <span className="text-sm text-gray-400">Top Score</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {users.length > 0 ? `${users[0]?.totalPoints || 0} pts` : '0 pts'}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-yellow-400 flex items-center justify-center">🏅</span>
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">
                {users.filter(user => (user.totalPoints || 0) > 0).length}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Updated</span>
              </div>
              <div className="text-sm font-medium text-gray-300">
                {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span>Rankings</span>
              <span className="text-sm text-gray-400">({users.length} players)</span>
            </h2>
            
            {users.length === 0 ? (
              <div className="text-center py-12">
                <span className="w-16 h-16 text-gray-600 mx-auto mb-4 flex items-center justify-center text-6xl">👥</span>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No players yet</h3>
                <p className="text-gray-500">Be the first to join the competition!</p>
              </div>
            ) : (
              users.map((user, index) => (
                <div
                  key={user._id || index}
                  className={`border rounded-lg p-4 transition-all duration-200 ${getRankStyle(index)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="font-medium text-white">
                          {user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-400">
                          Player {user._id?.slice(-6) || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white">
                        {user.totalPoints || 0} pts
                      </div>
                      {index < 3 && (
                        <div className="text-xs text-gray-400">
                          {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : 'Third Place'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;