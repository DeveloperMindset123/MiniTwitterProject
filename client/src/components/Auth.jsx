/* eslint-disable no-unused-vars */
//set up the authentication
import React, { useState } from 'react';
import '../styles/Auth.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//import Selection from './Selection'

export default function Auth(props) {

    let [authMode, setAuthMode] = useState("signin");


    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }

    if (authMode == 'signin') {
        return (
            <div className="Auth-form-container">
                <form className='Auth-form'>
                    <div className='Auth-form-content'>
                        <h3 className='Auth-form-title'>Sign In</h3>
                        <div className='text-center'>
                            Not Registered Yet?{" "}
                            <span className='link-primary cursor' onClick={changeAuthMode}>
                                Sign Up
                            </span>
                        </div>
                        <div className='form-group mt-3'>
                            <label>Email Address</label>
                            <input 
                                type='email'
                                className='form-control mt-1'
                                placeholder='Enter email'
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label>Password</label>
                            <input 
                                type='password'
                                className='form-control mt-1'
                                placeholder='Enter Password'
                            />
                        </div>
                        <div className='d-grid gap-2 mt-3'>
                            <button type='Submit' className='btn btn-primary'>
                                Submit
                            </button>
                        </div>
                        <p className='text-center mt-2'>
                            Forgot <a href='#'>Password?</a>
                        </p>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className='Auth-form-container'>
            <form className='Auth-form'>
                <div className='Auth-form-content'>
                    <h3 className='Auth-form-title'>Sign In</h3>
                    <div className='text-center'>
                        Already Registered?{" "}
                        <span className='link-primary cursor' onClick={changeAuthMode}>
                            Sign In
                        </span>
                    </div>
                    {/**Create the input section for entering full name */}
                    <div className='form-group mt-3'>
                        <label>Full Name</label>
                        <input 
                            type='email'
                            className='form-control mt-1'
                            placeholder='e.g. Hans Zimmer'
                        />
                    </div>
                    {/**Create the placeholder for entering password */}
                    <div className='form-group mt-3'>
                        <label>Email Address</label>
                        <input 
                            type='email'
                            className='form-control mt-1'
                            placeholder='Email Address'
                        />
                    </div>
                    {/**Create the input section for inputting password */}
                    <div className='form-group mt-3'>
                        <label>Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Enter Password'
                        />
                    </div>
                    {/**Create the input section for confirming password */}
                    <div className='form-group mt-3'>
                        <label>Confirm Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Retype Password'
                        />
                    </div>
                    <div>
                         <Selection />
                    </div>
                    <p className='text-center mt-2'>
                        Forgot <a href='#'>Password?</a>
                    </p>
                </div>
            </form>
        </div>

    )
}

function Selection() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [selectedInterests, setSelectedInterests] = useState([]);
    
    const interests = [
        {name:'Music', image:"/Music.jpg"},
        {name:'Entertainment', image:"/Entertainment.jpg"},
        {name:'Sports', image:"/Sports.jpg"},
        {name:'Gaming', image:"/Gaming.jpg"},
        {name:'Fashion', image:"/Fashion.jpg"},
        {name:'Beauty', image:"/Beauty.jpg"},
        {name:'Food', image:"/Food.jpg"},
        {name:'Finance', image:"/Finance.jpg"},
        {name:'Art', image:"/Art.jpg"},
        {name:'Technology', image:"/Technology.jpg"},
        {name:'Travel', image:"/Travel.jpg"},
        {name:'Outdoors', image:"/Outdoors.jpg"},
        {name:'Fitness', image:"/Fitness.jpg"},
        {name:'Careers', image:"/Careers.jpg"},
        {name:'Science',image:"/Science.jpg"}
    ];

    const handleInterestSelect = (interest) => {
        if (selectedInterests.includes(interest)) {
          setSelectedInterests(selectedInterests.filter((item) => item !== interest));
        } else {
          setSelectedInterests([...selectedInterests, interest]);
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault()
        handleShow();
  };

  
    return (
      <>
          <div className='d-grid gap-2 mt-3'>
              <button type='Submit' className='btn btn-primary' onClick={handleSubmit}>
                  Submit
              </button>
          </div>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select 3 feilds You Are Interesting In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            {interests.map((interest,index) => (
                <label key={index}>
                    <img className="interest-image" src={interest.image} alt={interest.name} />
                    <div className='text-center'>
                            <input
                            type='checkbox'
                            value={interest.name}
                            checked={selectedInterests.includes(interest.name)}
                            onChange={() => handleInterestSelect(interest.name)}
                            />{interest.name}
                    </div>
                </label>
            ))}
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Back
            </Button>
            <Button variant="primary">Next</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }





//note: continue here --> https://www.codementor.io/@supertokens/building-a-login-screen-with-react-and-bootstrap-1sqpm1iszfx