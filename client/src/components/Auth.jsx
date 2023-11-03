/* eslint-disable no-unused-vars */
//set up the authentication
import React, { useState } from 'react';
import '../styles/Auth.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
//import Selection from './Selection'

export default function Auth(props) {

    let [authMode, setAuthMode] = useState("signin");
    const [isCorporateUser, setIsCorporateUser] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);


    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }

	const handleSubmit = (event) => {
        event.preventDefault(); 
        // if the Corporate user is checked, then set corporate Modal to be opened, otherwise Selection Modal Open
        isCorporateUser? setIsModalOpen(true) :setIsSelectionModalOpen(!isSelectionModalOpen);
    };
   
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
                    <h3 className='Auth-form-title'>Sign Up</h3>
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
                    <div className="form-group mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isCorporateUser}
                                onChange={()=>setIsCorporateUser(!isCorporateUser)}
                                style={{ marginRight: "10px" }}
                            />
                            <label>Corporate User</label>
                        </div>
                        
                        <div className='d-grid gap-2 mt-3'>
                        <button type='Submit' className='btn btn-primary' onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                    <p className='text-center mt-2'>
                        Forgot <a href='#'>Password?</a>
                    </p>
                </div>
            </form>
            {isCorporateUser && (
                <Corporate isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                // only click submit, the pop up can be opened, either Corporate User or normal user
            )}
            {isSelectionModalOpen &&
             <Selection isSelectionModalOpen= {isSelectionModalOpen} setIsSelectionModalOpen={setIsSelectionModalOpen} />
            }

        </div>

    )
}
function Corporate({ isModalOpen, setIsModalOpen }) {
    const [isCustomerTargetModalOpen, setIsCustomerTargetModalOpen] = useState(false);

    const closePopup = () => {
        setIsModalOpen(false);
    }

    const OnClickContinueHandler =() =>{
        setIsCustomerTargetModalOpen(true);
        closePopup()
    }
    
    return (
    <div>
        <Modal show={isModalOpen} onHide={closePopup} className="CorporateModal">
            <Modal.Header closeButton>
                <Modal.Title>Corporate Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="corporateInformation">
                    <div className="corporate">
                        <label>Company Name</label>
                        <input type="text" placeholder="Enter your company name" />
                    </div>
                    <div className="corporate">
                        <label>Phone Number</label>
                        <input type="text" placeholder="Enter your phone number" />
                    </div>
                    <div className="corporate">
                        <label>Address</label>
                        <input type="address" placeholder="Enter your address" />
                    </div>
                    <div className="corporate">
                        <label>City</label>
                        <input type="address" placeholder="Enter your city" />
                    </div>
                    <div className="corporate">
                        <label>State</label>
                        <input type="address" placeholder="Enter your state" />
                    </div>
                    <div className="corporate">
                        <label>Zip Code</label>
                        <input type="address" placeholder="Enter the Zip Code" />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button
                            className="custom-button"
                            onClick={OnClickContinueHandler}
                        >
                        Continue
                        </button>
                </div>
                </div>
            </Modal.Body>
        </Modal>

        {isCustomerTargetModalOpen && (
                <CustomerTarget
                    isCustomerTargetModalOpen={isCustomerTargetModalOpen}
                    setIsCustomerTargetModalOpen={setIsCustomerTargetModalOpen}
                    setIsModalOpen ={setIsModalOpen}
                />
            )}
        </div>

    );
}

function CustomerTarget({isCustomerTargetModalOpen, setIsCustomerTargetModalOpen}) {

    const closeCustomerTargetModal = () => {
        setIsCustomerTargetModalOpen(false);
    }

    const doneHandler =() =>{
        setIsCustomerTargetModalOpen(false);
    }
   
    return (
        <Modal show={isCustomerTargetModalOpen} onHide={closeCustomerTargetModal} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Customer Target</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                        <Form.Group>
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Influencer"
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Gamer"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Business Professional"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Parent"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Student"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Tech Enthusiast"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Fitness Enthusiast"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Pet Owner"
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Homeowner"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Traveler"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Fashionistas"
                                
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Foodie"
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Outdoor Adventurer"
                            />
                            <Form.Check
                                className="custom-checkbox"
                                type="checkbox"
                                label="Shopper"
                            />
                        </Form.Group>
                    </Form>
                <div className="d-grid gap-2 mt-3">
                    <Button className="custom-button"variant="primary" onClick={doneHandler}>
                        Done
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function Selection({isSelectionModalOpen,setIsSelectionModalOpen}) {

    const closeSelectionModal = () => {
        setIsSelectionModalOpen(false);
    };
 
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

      const handleSubmit = () => {

      };


  
    return (
      <>
        <Modal
          show={isSelectionModalOpen}
          onHide={closeSelectionModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Personalization (Select at least 3) </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='Image-container'>
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
            <div className="d-grid gap-2 mt-3">
                    <Button className="custom-button"variant="primary" onClick={handleSubmit}>
                        Next
                    </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  





//note: continue here --> https://www.codementor.io/@supertokens/building-a-login-screen-with-react-and-bootstrap-1sqpm1iszfx