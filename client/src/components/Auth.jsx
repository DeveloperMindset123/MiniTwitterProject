/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
//set up the authentication
import React, { useState } from 'react';
import '../styles/Auth.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


export default function Auth(props) {

    let [authMode, setAuthMode] = useState("signin");
    const [isCorporateUser, setIsCorporateUser] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isTrendyUserOpen, setIsTrendyUserOpen] = useState(false);

    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }

	const handleSubmit = (event) => {
        event.preventDefault(); 
        // if the Corporate user is checked, then set corporate Modal to be opened, otherwise Selection Modal Open
        isCorporateUser? setIsModalOpen(true) :setIsSelectionModalOpen(true);
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
             <Selection isSelectionModalOpen= {isSelectionModalOpen} 
             setIsSelectionModalOpen={setIsSelectionModalOpen} 
             setIsTrendyUserOpen ={setIsTrendyUserOpen}
             />
            }

            {isTrendyUserOpen && !isSelectionModalOpen && (<TrendyUser
                    isTrendyUserOpen={isTrendyUserOpen}
                    setIsTrendyUserOpen={setIsTrendyUserOpen}
                    />
            )}

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
        <Modal show={isModalOpen} onHide={closePopup} className="CorporateModal" backdrop="static">
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
                        <Button
                            className="custom-button"
                            onClick={OnClickContinueHandler}
                        >
                        Continue
                        </Button>
                </div>
                </div>
            </Modal.Body>
        </Modal>
        {isCustomerTargetModalOpen && (
                <CustomerTarget
                    isCustomerTargetModalOpen={isCustomerTargetModalOpen}
                    setIsCustomerTargetModalOpen={setIsCustomerTargetModalOpen}
                />
            )}
        </div>

    );
}

function CustomerTarget({isCustomerTargetModalOpen, setIsCustomerTargetModalOpen}) {

    const [selectedInterests, setSelectedInterests] = useState([]);

    const interests = [
        'Influencer',
        'Gamer',
        'Business Professional',
        'Parent',
        'Student',
        'Tech Enthusiast',
        'Fitness Enthusiast',
        'Pet Owner',
        'Homeowner',
        'Traveler',
        'Fashionistas',
        'Foodie',
        'Outdoor Adventurer',
        'Shopper',
      ];

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        if (selectedInterests.includes(value)) {
          setSelectedInterests(selectedInterests.filter((interest) => interest !== value));
        } else {
          setSelectedInterests([...selectedInterests, value]);
        }
      };


    const closeCustomerTargetModal = () => {
        setIsCustomerTargetModalOpen(false);
    }

    const doneHandler =() =>{
        closeCustomerTargetModal();
        //console.log('Selected interests:', selectedInterests);
    }
   
    return (
        <Modal show={isCustomerTargetModalOpen} onHide={closeCustomerTargetModal} className="custom-modal" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Customer Target</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {interests.map((interest) => (
                        <Form.Check
                        key={interest}
                        className="custom-checkbox"
                        type="checkbox"
                        label={interest}
                        name={interest}
                        value={interest}
                        onChange={handleCheckboxChange}
                        />
                    ))}
                </Form>
                <div className="d-grid gap-2 mt-3">
                    <Button  className="custom-button"variant="primary" onClick={doneHandler}>
                        Done
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function Selection({isSelectionModalOpen,setIsSelectionModalOpen,setIsTrendyUserOpen}) {

    const closeSelectionModal = () => {
        setIsSelectionModalOpen(false);
    };


    const OnClickContinueHandler = () =>{
        if(selectedInterests.length >= 3){
            setIsTrendyUserOpen(true)
            closeSelectionModal()
        }else{
            alert("pick at least 3")
        }
    }
 
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

    return (
      <>
        <div className='d-grid gap-2 mt-3'>
                        <button type='Submit' className='btn btn-primary' onClick={handleSubmit}>
                            Submit
                        </button>
    </div>
  
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
                    <Button className="custom-button"variant="primary" onClick={OnClickContinueHandler}>
                        Continue
                    </Button>
            </div>
          </Modal.Body>
        </Modal>
        </>
    );
  }

function TrendyUser({isTrendyUserOpen, setIsTrendyUserOpen}) {
   
    const closePopup = () => {
        setIsTrendyUserOpen(false);
    }


    const [users, setUsers] = useState([
        { id: 1, name: 'User 1', isFollowing: false },
        { id: 2, name: 'User 2', isFollowing: false },
        { id: 3, name: 'User 3', isFollowing: false },
        { id: 4, name: 'User 4', isFollowing: false },
        { id: 5, name: 'User 5', isFollowing: false },
      ]);

      const toggleFollow = (userId) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, isFollowing: !user.isFollowing }
              : user
          )
        );
      };


      const doneHandler = () => {
        closePopup()
      }
 

    
    return (
        <Modal show={isTrendyUserOpen} onHide={closePopup}  backdrop="static" >
            <Modal.Header closeButton>
                <Modal.Title>You might like to follow</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="suggested-box">
                 <div className="card-body">
                <ul className="list-group suggestions-list">
                {users.map((user) => (
                <li key={user.id} className="list-group-item d-flex align-items-center">
                  <img
                    src="\public\Art.jpg"
                    alt={user.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '10px' }}
                  />
                  <p className="mb-0">{user.name}</p>
                  <button className="btn btn-primary ml-auto follow-button" onClick={() => toggleFollow(user.id)}>
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </li>
                ))}
                </ul>
                </div> 
            </div>
            <div className="d-grid gap-2 mt-3">
                <Button
                    className="custom-button"
                    onClick={doneHandler}    
                        >
                        Done
                </Button>
            </div>
            </Modal.Body>
        </Modal>

    );
}





//note: continue here --> https://www.codementor.io/@supertokens/building-a-login-screen-with-react-and-bootstrap-1sqpm1iszfx