import React, { useEffect, useState } from 'react';

function UserDropdown({ onSelect, placeholder = "Select User", className = "" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort users alphabetically by name
        const sortedUsers = data.sort((a, b) => {
          const nameA = (a.name || 'Anonymous').toLowerCase();
          const nameB = (b.name || 'Anonymous').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        setUsers(sortedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelection = (e) => {
    const selectedId = e.target.value;
    if (selectedId && onSelect) {
      // Find the selected user object
      const selectedUser = users.find(user => user._id === selectedId);
      onSelect(selectedId, selectedUser);
    }
  };

  const baseStyles = `
    w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
    bg-slate-800 text-white border-slate-600
    hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  if (loading) {
    return (
      <div className="relative">
        <select disabled className={`${baseStyles} cursor-wait`}>
          <option>Loading users...</option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <select disabled className={`${baseStyles} border-red-500/50 bg-red-900/20`}>
          <option>Error loading users</option>
        </select>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select 
        onChange={handleSelection}
        className={baseStyles}
        disabled={users.length === 0}
      >
        <option value="">
          {users.length === 0 ? "No users available" : placeholder}
        </option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name || 'Anonymous'}
            {user.totalPoints !== undefined && ` (${user.totalPoints} pts)`}
          </option>
        ))}
      </select>
      
      {/* Dropdown arrow */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* User count badge */}
      {users.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
          {users.length}
        </div>
      )}
    </div>
  );
}

export default UserDropdown;