import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import { Row,Col,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import {Post} from './components/UploadDB.js';


const Upload = () => {
  const [userId, setUserId] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [formValid, setFormValid] = useState('');
  const [textOverflow, setTextOverFlow] = useState('');
  const [hashOverflow, setHashOverFlow] = useState(false)

  useEffect(()=>{ // post button validation
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

    try {
      // make post
      const response = await axios.post('http://localhost:4000/api/save-new-post', uniquePost, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Post saved successfully!', response);
        setUserId('');
        setBodyText('');
      }
      else if(response.status === 400){
        alert('Bad Request: ' + response.data.error);
      }
      else {
        alert('Error saving new post: ' + response.data.error);
      }

      // charge account if overflow
      // first GET the user -> create new updated user with money reducted
      // need to set up user session first
      } catch (err) {
      if(err.response.status === 403){
        alert(err.response.data.message);
      } else{
        alert('Error saving post or making connection: ' + err.message);
      }
    }
  };


  return (
    <div style={{/* justifyContent: 'center' */ marginLeft: "260px"}}>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} style={{marginBottom: '1px'}}>
          <Form.Label column lg="2"> UserID:</Form.Label>
          <Col md ="10">
          <Form.Control style ={{marginRight: '380px', width: '150.4px', height: '35px'}}
          placeholder="UserID" type="text" value={userId} 
          onChange={(event) => setUserId(event.target.value)}/>
          </Col>
        </Form.Group>
  {/*         <input type="text" value={userId} onChange={(event) => setUserId(event.target.value)} /> */}
  {/*       <label>BodyText (add hashtags with '#'):</label> */}
  {/*       <textarea value={bodyText} onChange={(event) => setBodyText(event.target.value)} /> */}

        <Form.Group as={Row} >
          <Form.Control as="textarea" value={bodyText} 
            onChange={(event) => setBodyText(event.target.value)} 
            style ={{marginLeft: '10px', width: '340.4px', height: '80.2px', resize: 'none', border: 'none' }}
            placeholder='What is Happening?!'
          />
        </Form.Group>

        {textOverflow > 0 && (
          <div> {/* for Common User */}
            You are {textOverflow} words overlimit! You will be charged ${(textOverflow)*1}
          </div>
        )}

        <Form.Group as={Row} style={{marginTop: "5px"}}>
          <Col>
            <Button size="sm" variant="dark"  >
              <FontAwesomeIcon icon={faImage} size="sm" />
            </Button>
            <Button size="sm" variant="dark" style={{marginLeft: '1px'}}>
            <FontAwesomeIcon icon={faFilm} size="sm" />
            </Button>
            <Button size="sm" variant="dark" type="submit" disabled={!formValid} style={{marginLeft: '200px'}}>
              Save Post
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Upload;
