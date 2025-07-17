import React, { useState } from 'react';

function ClaimButton({ userId, onClaim }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [lastClaimedPoints, setLastClaimedPoints] = useState(null);

  const claimPoints = async () => {
    if (!userId) {
      setError('Please select a user first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Simulate API call with fetch
      const response = await fetch('http://localhost:5000/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to claim points');
      }
      
      const data = await response.json();
      setLastClaimedPoints(data.points);
      setIsSuccess(true);
      onClaim(data.points);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setLastClaimedPoints(null);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to claim points. Please try again.');
      console.error('Claim error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span>+{lastClaimedPoints} Points Claimed!</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="text-xl">⚡</span>
        <span>Claim Points</span>
      </div>
    );
  };

  const getButtonStyles = () => {
    if (isLoading) {
      return 'bg-blue-500/50 cursor-not-allowed';
    }
    
    if (isSuccess) {
      return 'bg-green-500 hover:bg-green-600 transform scale-105';
    }

    if (error) {
      return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse';
    }

    return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-xl';
  };

  return (
    <div className="space-y-4">
      {/* Main Claim Button */}
      <button
        onClick={claimPoints}
        disabled={isLoading || !userId}
        className={`w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${getButtonStyles()} ${
          !userId ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {getButtonContent()}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-slideIn">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">!</span>
            </div>
            <div>
              <div className="text-red-400 font-semibold">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {isSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 animate-slideIn">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <div className="text-green-400 font-semibold">Success!</div>
              <div className="text-green-300 text-sm">
                You've earned {lastClaimedPoints} points
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <div className="text-xl font-bold text-white">⚡</div>
            <div className="text-xs text-gray-400 mt-1">Ready</div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {isLoading ? '...' : lastClaimedPoints || '0'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Last Claim</div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {userId ? '✓' : '⚠'}
            </div>
            <div className="text-xs text-gray-400 mt-1">User Status</div>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          {!userId 
            ? 'Select a user to start claiming points' 
            : isLoading 
              ? 'Processing your request...' 
              : 'Click the button above to claim your points'
          }
        </p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ClaimButton;