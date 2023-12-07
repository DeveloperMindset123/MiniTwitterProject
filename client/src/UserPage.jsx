import React, { useState, useEffect } from 'react';
import { GetUser } from './components/UploadDB';

const UserPage = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      async function fetchUserData() {
        const userData = await GetUser({ userId });
        setUser(userData);
      }

      fetchUserData();
    }
  }, [userId]);

  const renderUserData = () => {
    if (!user) {
      return <p>{userId ? 'Loading...' : 'No user ID provided'}</p>;
    }

    const { password, ...userDetails } = user; // Exclude 'password' from being displayed

    return (
      <div>
        <h2>User Information</h2>
        {Object.entries(userDetails).map(([key, value]) => (
          <p key={key}>
            {key}: {Array.isArray(value) ? value.join(', ') : value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', padding: '20px' }}>
      {renderUserData()}
    </div>
  );
};

export default UserPage;
