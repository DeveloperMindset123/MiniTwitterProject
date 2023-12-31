/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
//set up the authentication
import React, { useState } from 'react';
import { ThemeContext, themes } from './ThemeContext';
import InputGroup from 'react-bootstrap/InputGroup'; 
import ToggleDark from './ToggleDark';
import '../styles/Auth.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { User } from './UploadDB';
let newUser = new User();
import { useNavigate } from 'react-router-dom';

// create user's session cookie
function setCookie(name, value, daysToExpire) {
  var date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + ";path=/";
}
function deleteCookie(name) { setCookie(name, "", -1); }
export default function Auth(props) { //login
    const navigate = useNavigate();
    let [authMode, setAuthMode] = useState("signin");
    const [isCorporateUser, setIsCorporateUser] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isTrendyUserOpen, setIsTrendyUserOpen] = useState(false);

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(true);

    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }

    const handleSignIn = (event) => {
        event.preventDefault();
        let userId = '';

        new Promise((resolve, reject) => {
        axios.get('http://localhost:4000/api/check-user', {
            params:{
                userName: username,
                password: password
            }
        }).then(response => {
            setCookie('username', response.data.id, 36500); // Setting it for 100 years
            userId = response.data.id;

            resolve(response);
            }).catch(error => reject(error));
        }).then(res => {
            console.log(res.data.message);
            
            navigate('/');
        }).catch(err => {
            alert(err.response.data.message)
            console.error(err);
        });
    }

	const handleSignUp = (event) => {
        event.preventDefault(); 
        //update recorded values
        newUser.userName = username;
        newUser.email = email;
        newUser.password = password;

        if(isCorporateUser){
            newUser.corpo = true;
            newUser.normal = false;
        }

        console.log("New User Updated:" + newUser);

        // if the Corporate user is checked, then set corporate Modal to be opened, otherwise Selection Modal Open
        isCorporateUser? setIsModalOpen(true) :setIsSelectionModalOpen(true);

    };
   
    if (authMode == 'signin') { // signin
        return (
            
            <div className="Auth-form-container">
                <div className="mode-toggle-containers"> {/**the CSS for this div is defined in the Landing.css file */}
              <InputGroup>
              <ThemeContext.Consumer>
                {({ changeTheme }) => (
                <ToggleDark
                    toggleDark={() => {
                    setDarkMode(!darkMode);
                    changeTheme(darkMode ? themes.light : themes.dark);
                  }}
                />
              )}
            </ThemeContext.Consumer>
              </InputGroup>
              </div>
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
                            <label>User Name</label>
                            <input 
                                type='text'
                                className='form-control mt-1'
                                placeholder='Enter username'
                                value={username}
                                onChange={e => setUserName(e.target.value)}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label>Password</label>
                            <input 
                                type='password'
                                className='form-control mt-1'
                                placeholder='Enter Password'
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                            />
                        </div>
                        
                        <div className='d-grid gap-2 mt-3'>
                            <button type='Submit' className='btn btn-primary' onClick={handleSignIn}>
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

    return ( // signup
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
                    {/** full name */}
                    <div className='form-group mt-3'>
                        <label>User Name</label>
                        <input 
                            type='text'
                            className='form-control mt-1'
                            placeholder='User Name'
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>
                    {/** email */}
                    <div className='form-group mt-3'>
                        <label>Email Address</label>
                        <input 
                            type='email'
                            className='form-control mt-1'
                            placeholder='Email Address'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    {/** password */}
                    <div className='form-group mt-3'>
                        <label>Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Enter Password'
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                        />
                    </div>
                    {/**confirming password */}
                    <div className='form-group mt-3'>
                        <label>Confirm Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Retype Password'
                        />
                    </div>
                    {/** Corpo */}
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
                        <button type='Submit' className='btn btn-primary' onClick={handleSignUp}>
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

// if corpo checked
function Corporate({ isModalOpen, setIsModalOpen }) {
    const [isCustomerTargetModalOpen, setIsCustomerTargetModalOpen] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const closePopup = () => {setIsModalOpen(false);}

    const OnClickContinueHandler =() =>{
        setIsCustomerTargetModalOpen(true);
        const corpoInfo = {'companyname': companyName, 'phonenumber': phoneNumber, 'address': address, 'city': city,'state': state, 'zipcode': zipCode};
        console.log(corpoInfo);
        newUser.corpoInfo = corpoInfo;

        closePopup();
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
                        <input 
                            type="text" 
                            placeholder="Enter your company name"
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)} 
                        />
                    </div>
                    <div className="corporate">
                        <label>Phone Number</label>
                        <input 
                            type="text" 
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="corporate">
                        <label>Address</label>
                        <input 
                            type="address" 
                            placeholder="Enter your address" 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            />
                    </div>
                    <div className="corporate">
                        <label>City</label>
                        <input 
                            type="address" 
                            placeholder="Enter your city" 
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            />
                    </div>
                    <div className="corporate">
                        <label>State</label>
                        <input 
                            type="text" 
                            placeholder="Enter your state" 
                            value={state}
                            onChange={e => setState(e.target.value)}
                            />
                    </div>
                    <div className="corporate">
                        <label>Zip Code</label>
                        <input 
                            type="text" 
                            placeholder="Enter your Zip Code" 
                            value={zipCode}
                            onChange={e => setZipCode(e.target.value)}
                            />                    
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
// after corpo info 
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

    const doneHandler =() =>{ // axios post for corpo only
        closeCustomerTargetModal();
        console.log('Selected interests:', selectedInterests);

        newUser.interests = selectedInterests;

    new Promise((resolve, reject) => {
        axios.post('http://localhost:4000/api/create-user', newUser)  //the purpose of this api endpoint is to create new users and provide a cookie for session handling
             .then(response => {
                setCookie('username', response.data.id, 36500); // Setting it for 100 years
                resolve(response);
                })
             .catch(error => reject(error));
        }).then(res => {
            console.log(res);
            alert("Thank you for creating an account! A super user will approve your account soon!\n Please make an initial payment to start using the app!!")
            document.location.href = '/payment';
        }).catch(err => {
            console.error(err);
        });
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
// if ordinary user
function Selection({isSelectionModalOpen,setIsSelectionModalOpen,setIsTrendyUserOpen}) {
    const closeSelectionModal = () => {
        setIsSelectionModalOpen(false);
    };

    const OnClickContinueHandler = () =>{
        if(selectedInterests.length >= 3){
            newUser.interests = selectedInterests;
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
      <div>
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

        
      </div>
    );
}
// after ordinary user
function TrendyUser({isTrendyUserOpen, setIsTrendyUserOpen}) {
    const closePopup = () => {
        setIsTrendyUserOpen(false);
    }

    // shit this should be dynamic
    const [users, setUsers] = useState([
        { id: 1, name: 'LordFarquaad', isFollowing: false },
        { id: 2, name: 'woahzuh', isFollowing: false },
        { id: 3, name: 'notHarryOsborn', isFollowing: false },
        { id: 4, name: 'peetah', isFollowing: false },
        { id: 5, name: 'n0obmaster69', isFollowing: false },
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
    newUser.following = users.filter(user => user.isFollowing);

    const doneHandler = () => {
        new Promise((resolve, reject) => {
            axios.post('http://localhost:4000/api/create-user', newUser)
            .then(response => {
                setCookie('username', response.data.id, 36500); // Setting it for 100 years
                resolve(response);
                })
            .catch(error => reject(error));
        }).then(res => {
            console.log(res);
            alert("Thank you for creating an account! A super user will approve your account soon!\n Please make an initial payment to start using the app!!")
            document.location.href = '/payment';
        }).catch(err => {
            console.error(err);
        });
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
