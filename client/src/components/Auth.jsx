/* eslint-disable no-unused-vars */
//set up the authentication
import React, { useState, useRef } from 'react';
import '../styles/Auth.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';  // we will need this to make api endpoint calls
//import { response } from 'express';  --> we are not using this right now, uncomment this if needed


export default function Auth(props) {

    //we can use useState to change the values stated here following the tutorial
    const [name, setName] = useState(""); //initialize name to be an empty string, will be replaced by the user input
    const [email, setEmail] = useState("");  //initialize email to be an empty string, will be replaced by the user input
    const [password, setPassword] = useState("");  //we will store the password in string format as well, we don't have to worry about security implications as that is not part of the project requirements
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCorporateUser, setIsCorporateUser] = useState(false);  //by default, user will not be a corporate user
    const [isOrdinaryUser, setIsOrdinaryUser] = useState(true);  //by default, if user is not corporate, user will be ordinary
    const [isTrendyUser, setIsTrendyUser] = useState(false); //by default, user will not be trendy user, user can only be trendy user if they are first an ordinary user

    const handleSubmit = async (e) => {
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }
    
        const role = isCorporateUser ? "corporate" : "ordinary";
    
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:4000/insert", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: name,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    role: role
                }),
            });
    
            if (!response.ok) {
                // Handle non-successful response
                console.error("Error registering user:", response.statusText);
                return;
            }
    
            const data = await response.json(); //--> this was causing an error becuase it wasn't sending any JSON back
            console.log("User successfully registered:", data);
            // Additional logic or state updates can be done here upon successful registration.
        } catch (error) {
            console.error("Error registering user: ", error);
            // Handle errors, display error messages, or update state accordingly.
        }
    };
    


    let [authMode, setAuthMode] = useState("signin");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
   // const [isTrendyUserOpen, setIsTrendyUserOpen] = useState(false);  --> moved above

    const formRef = useRef(null);  //initialized as a null value, will be updated depending on user input

    /*  --> comment this out as we won't use it at the momemnt
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    }) */

    /*
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            //this will update the form data
            ...formData,
            [name]: value,  //set the name which serves as a placeholder and the value that is inputted by the user
        })
    }
*/
//the below function helps ensure that user can signup if they don't have an account
    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }


    //update the handleSubmit function to send a POST request to the '/login' or '/register' endpoint based on the 'authMode'. The fetch API can be used or any other method such as axios
    /*  --> has been defined above in simpler form
	const handleSubmit = (event) => {
        
        event.preventDefault(); 
        //now, thanks to the handlechange function, 'formdata' will contain the values from the form inputs and can be used when constructing the JSON payload for the API request
        //access form data
        const { fullname, email, password, confirmPassword, Corporate } = formData;

        //now we can create a JSOn payload given our data --> what is a JSON payload? --> JSON payload refers to the data sent in the body of an HTTP request or response, usually in the context of APIs, webhooks or other data exchange mechanism
        const requestBody = {
            fullname: fullname,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            Corporate: isCorporateUser,  //we  already have the useState handling whether it is a corporate user or not, thanks to useState in React
        }


        const endpoint = authMode === 'signin' ? '/login' : '/register';  //we are utilizing javascript ternary operators to check if signin or registration
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                requestBody,  //this will return requestBody as a JSON format on the console 
            })
        }) 
        // if the Corporate user is checked, then set corporate Modal to be opened, otherwise Selection Modal Open
        //isCorporateUser? setIsModalOpen(true) :setIsSelectionModalOpen(true);  --> throwing an error
    }; */

    //add the onchange event handlers to the form inputs
   
    if (authMode == 'signin') {
        return (
            <div className="Auth-form-container">
                <form className='Auth-form' ref={formRef} onSubmit={handleSubmit}> {/**Attach formRef on the ref section of the react <form> tag */}
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
                                //value={formData.email} =-> this parameter doesn't allow inputs in our case, the email and username means the same thing for the sake of simplicity
                                //onChange={handleChange}  --> leave this empty for now as authentication logic has not yet been fully implemented 
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label>Password</label>
                            <input 
                                type='password'
                                className='form-control mt-1'
                                placeholder='Enter Password'
                                //value={formData.password}
                                //onChange={handleChange}
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
            <form className='Auth-form' onSubmit={handleSubmit}>
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
                           // value={formData.fullname}
                            onChange={(e) => {setName(e.target.value)}} //get the value of the user input and update it
                        />
                    </div>
                    {/**Create the placeholder for entering password */}
                    <div className='form-group mt-3'>
                        <label>Email Address</label>
                        <input 
                            type='email'
                            className='form-control mt-1'
                            placeholder='Email Address'
                            //value={formData.email}
                            onChange={(e) => {setEmail(e.target.value)}}  //get the value of the user email address
                        />
                    </div>
                    {/**Create the input section for inputting password */}
                    <div className='form-group mt-3'>
                        <label>Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Enter Password'
                            //value={formData.password}
                            onChange={(e) => {setPassword(e.target.value)}}  //set the password to the user password input
                        />
                    </div>
                    {/**Create the input section for confirming password */}
                    <div className='form-group mt-3'>
                        <label>Confirm Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1'
                            placeholder='Retype Password'
                            //value={formData.confirmPassword}
                            onChange={(e) => {setConfirmPassword(e.target.value)}}  //set the confirm password and the function for handle submit will check if the password  and confirm password values matches 
                        />
                    </div>
                    <div className="form-group mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isCorporateUser}
                                /**We will need to ensure when the user clicks on this checkbox, the useState property can be used to change the values */
                                onChange={()=>{
                                    setIsCorporateUser(!isCorporateUser);  //when the user selects the checkbox, it will ensure that the corporate user value is changed to true (default false)
                                    setIsOrdinaryUser(!isOrdinaryUser);  //this will ensure that upon checking the box for corporate user, the ordinary user value is changed to false
                                }}
                                style={{ marginRight: "10px" }}
                            />
                            <label>Corporate User</label>
                        </div>
                        
                        <div className='d-grid gap-2 mt-3'>
                        <button type='button' className='btn btn-primary' onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                    <p className='text-center mt-2'>
                        Forgot <a href='#'>Password?</a>
                    </p>
                </div>
            </form>
        </div>

            /*
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
            */
    )
}

/*function Corporate({ isModalOpen, setIsModalOpen }) {
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
} */





//note: continue here --> https://www.codementor.io/@supertokens/building-a-login-screen-with-react-and-bootstrap-1sqpm1iszfx