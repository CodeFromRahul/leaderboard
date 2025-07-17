import React, { useEffect, useState } from 'react';

function History({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/history/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const getFilteredHistory = () => {
    if (filter === 'all') return history;
    
    const now = new Date();
    const filtered = history.filter(item => {
      const itemDate = new Date(item.timestamp);
      const diffTime = now - itemDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      switch (filter) {
        case 'today':
          return diffDays < 1;
        case 'week':
          return diffDays < 7;
        case 'month':
          return diffDays < 30;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  const getTotalPoints = () => {
    return getFilteredHistory().reduce((sum, item) => sum + item.pointsClaimed, 0);
  };

  const getAveragePoints = () => {
    const filtered = getFilteredHistory();
    if (filtered.length === 0) return 0;
    return Math.round(getTotalPoints() / filtered.length);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays < 1) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getPointsIcon = (points) => {
    if (points >= 100) return '🔥';
    if (points >= 50) return '⚡';
    if (points >= 25) return '✨';
    return '💫';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300">Loading history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white">!</span>
          </div>
          <div>
            <div className="text-red-400 font-semibold">Failed to load history</div>
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const filteredHistory = getFilteredHistory();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{filteredHistory.length}</div>
          <div className="text-xs text-gray-400 mt-1">Total Claims</div>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{getTotalPoints()}</div>
          <div className="text-xs text-gray-400 mt-1">Total Points</div>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{getAveragePoints()}</div>
          <div className="text-xs text-gray-400 mt-1">Avg Points</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All Time' },
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl opacity-60">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No History Found</h3>
            <p className="text-gray-500 text-sm">
              {filter === 'all' 
                ? 'No claims have been made yet.' 
                : `No claims found for ${filter === 'today' ? 'today' : filter === 'week' ? 'this week' : 'this month'}.`
              }
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 animate-slideIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">{getPointsIcon(item.pointsClaimed)}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      +{item.pointsClaimed} Points
                    </div>
                    <div className="text-gray-400 text-sm">
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.pointsClaimed >= 100 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : item.pointsClaimed >= 50 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.pointsClaimed >= 100 ? 'Excellent' : 
                     item.pointsClaimed >= 50 ? 'Great' : 'Good'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {filteredHistory.length > 0 && (
        <div className="flex justify-center space-x-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-sm text-gray-400">Best Claim</div>
            <div className="text-lg font-bold text-white">
              {Math.max(...filteredHistory.map(h => h.pointsClaimed))} pts
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Latest Claim</div>
            <div className="text-lg font-bold text-white">
              {formatDate(filteredHistory[0]?.timestamp)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default History;