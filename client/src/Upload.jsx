import { React, useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import { Row,Col,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import {Post} from './components/UploadDB.js';
import '../src/styles/Upload.css'

async function GetUser({userId}) {
  try{
    const response = await axios.get('http://localhost:4000/api/fetch-user/', {params: {userId}});
    if(response.status === 200){
      return response.data;
    } else {
      console.error('Error fetching user');
    }
  } catch (error) {
      console.error('Error fetching user', error);
      return null;
    }
}

const Upload = ({ userId }) => {
  // its gotta be placed at top level to prevent crashing
  // if(userId === undefined){
  //   return (
  //     <div>Loading...</div>
  //   )
  // }
  console.log('Upload page has userId:', userId);
  const [bodyText, setBodyText] = useState('');
  const [formValid, setFormValid] = useState('');
  const [textOverflow, setTextOverFlow] = useState('');
  const [hashOverflow, setHashOverFlow] = useState(false);
  const [chargeRate, setChargeRate] = useState(1);
  const [user, setUser] = useState({});
    
  useEffect(() => {
    if (userId === undefined) {
      // You may want to handle the undefined case differently, maybe set a loading state.
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await GetUser({ userId });
        setUser(user);
        // console.log(user);
    if (user && !user.corpo) {
          setChargeRate(0.1);
        }
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };

    // Call the async function
    fetchUser();
  }, [userId]); // Only re-run the effect if userId changes  
  
  // post button validation
  useEffect(()=>{ 
    // sets condition to hit submit (body must be larger than 2 chars and hashtags <=3)
    setFormValid(bodyText.length > 1 && !hashOverflow);

    // sets textoverflow when words > 20
    let words = bodyText.split(/\s+/).length;
    if(words > 20){
      setTextOverFlow(bodyText.split(/\s+/).length - 20);
    } else{
      setTextOverFlow(0);
    }

    // hash overflow logic (there is a hashtag and there's less than 3)
    if(bodyText.match(/#\w+/g) != null && bodyText.match(/#\w+/g).length <= 3){
      setHashOverFlow(false);
    } else if(bodyText.match(/#\w+/g) == null){
      setHashOverFlow(false);
    } else{
      setHashOverFlow(true);
    }
  }, [bodyText, hashOverflow]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hashTags = bodyText.match(/#\w+/g);

    const uniquePost = new Post(userId, bodyText, hashTags);

    try {// make post
      const response = await axios.post('http://localhost:4000/api/save-new-post', uniquePost, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Post saved successfully!', response);
        setBodyText('');
      }
      else if(response.status === 400){
        alert('Bad Request: ' + response.data.error);
      }
      else {
        alert('Error saving new post: ' + response.data.error);
      }
      } catch (error) {
      if(error.status === 403){
        alert(error.data.message);
      } else{
        alert('Error saving post or making connection: ' + error.message);
      }
    }
    // update user's cash amount
    try{
      const response = await axios.post('http://localhost:4000/api/update-user', uniquePost, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('User updated successfully!', response);
      }
      else if(response.status === 400){
        alert('Bad Request: ' + response.data.error);
      }
      else {
        alert('Error updating user: ' + response.data.error);
      }
      }catch(error){
        alert('Error updating user or making connection: ' + error.message);
      }
  };

  if(userId === undefined){
    return <div className='form-submit'> You must be logged in to upload a post! </div>
  }

  return (
    <div className='form-container'>
      <Form onSubmit={handleSubmit}>
        <Row  className='Group-Form'>
          <textarea className='body-textarea' value={bodyText} onChange={(event) => setBodyText(event.target.value)} 
            placeholder='What is Happening?!'
          />
        </Row>

        {textOverflow > 0 && (
          <div> {/* for Common User */}
            You are {textOverflow} words overlimit! You will be charged ${parseFloat((textOverflow)*chargeRate).toFixed(2)}
          </div>
        )}

        <Row className='Group-Form'>
          <Col>
            <Button size="md" variant="dark" className='imageButton' >
              <FontAwesomeIcon icon={faImage} size="sm" />
            </Button>
            <Button size="md" variant="dark" className='videoButton'>
            <FontAwesomeIcon icon={faFilm} size="sm" />
            </Button>
            <Button size="md" variant="dark" type="submit" disabled={!formValid} className='savePostButton'>
              {!user.corpo ? <div>{!user.corpo ? <div>Save Post</div> : <div>Save New Ad/Job Posting</div>}</div> : <div>Save New Ad/Job Posting</div>}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Upload;
