import React, { useState, useEffect } from 'react';
import { GetUser } from './components/UploadDB';

const UserPage = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ensure userId is not null before making the request
    if (userId) {
      async function fetchUserData() {
        const userData = await GetUser({ userId });
        setUser(userData);
      }

      fetchUserData();
    }
  }, [userId]);

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', padding: '20px' }}>
      {user ? (
        <div>
          <h2>User Information</h2>
          <p>User ID: {user._id}</p>
          <p>Username: {user.userName}</p>
          <p>Email: {user.email}</p>
          <p>Cash: {user.cash}</p>
          <p>Bio: {user.bio}</p>
          <p>Likes: {user.likes}</p>

        </div>
      ) : (
        <p>{userId ? 'Loading...' : 'No user ID provided'}</p>
      )}
    </div>
  );
};

export default UserPage;
