import React, { useState } from 'react';
import axios from 'axios';
import {Post} from './dataTypes/UploadDB.js';

const Upload = () => {
  const [userId, setUserId] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [hashTags, setHashTags] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const uniquePost = new Post(
      userId,
      bodyText,
      hashTags
    );

    try {
      const response = await axios.post('http://localhost:4000/api/save-new-post', uniquePost);

      if (response.status === 201) {
        alert('Post saved successfully!', response);
        setUserId('');
        setBodyText('');
        setHashTags('');
      } else {
        alert('Error saving new post: ' + response.data.error);
      }
    } catch (err) {
      alert('Error saving new post: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>UserId:</label>
      <input type="text" value={userId} onChange={(event) => setUserId(event.target.value)} />

      <label>BodyText:</label>
      <textarea value={bodyText} onChange={(event) => setBodyText(event.target.value)} />

      <label>HashTags:</label>
      <textarea value={hashTags} onChange={(event) => setHashTags(event.target.value)} />

      <button type="submit">Save Post</button>
    </form>
  );
};

export default Upload;
