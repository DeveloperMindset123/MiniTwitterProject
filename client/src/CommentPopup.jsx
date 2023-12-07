import React, { useState } from 'react';
import '../src/styles/CommentPopup.css';


function CommentPopup({ postId, onClose }) {
 const [commentText, setCommentText] = useState('');


 const handleCommentChange = (e) => {
   setCommentText(e.target.value);
 };


 const handleCommentSubmit = () => {
   setCommentText('');
   onClose();
 };


 return (
   <div className="comment-popup">
     <h3>Comments</h3>
     <textarea
       rows="2"
       cols="30"
       style={{ marginBottom: '10px' }}
       placeholder="Type your comment here"
       value={commentText}
       onChange={handleCommentChange}
     />
     <br />
     <button onClick={handleCommentSubmit} style={{ marginRight: '10px', color:'white' }}>
       Post
     </button>
     <button onClick={onClose} style={{ color:'white' }}>Cancel</button>
   </div>
 );
}


export default CommentPopup;
