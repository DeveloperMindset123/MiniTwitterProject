/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState }  from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { Container, Row, Col, Button } from "react-bootstrap"; --> import them individually instead
import { faApple, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css'; //NOTE: YOU MUST IMPORT THIS FOR BOOTSTRAP TO RENDER
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import '../src/styles/Landing.css'; //NOTE 2: STYLESHEET MUST BE PLACED AFTER BOOTSTRAP TO RENDER CORRECTLY

//this part of the website will have the typical landing page of twitter, but instead with our logo
//just follow this tutorial: https://www.sitepoint.com/google-auth-react-express/
function Landing() {

  //define the useNavigate function
  const navigate = useNavigate();

  const navigateToAuthentication = () => {
    //navigate to contacts
    navigate('/Auth');
  };

  const navigateHome = () => {
    //navigate to home
    navigate('/'); //this will allow the user to navigate back to the landing page
  }

  const [user, setUser] = useState(null);
  const handleGoogleLogin = async () => {
    try {
      //Make a post request to the backend endpoint for Google Authentication
      const response = await axios.post("http://localhost:5173/auth/google/callback");  //update this to have the correct api endpoint connected to the backend

      //handle the response from the backend
      const userData = response.data;

      //update the state of the user's information
      setUser(userData);
    } catch(error) {
      console.error("Error during google login: ", error);
    }
  }


  return (
    
    <div> 
      <Container fluid>
        <Row>
          {/**We will be displaying the content within nested rows/columns */}
          <Col className="logo-box"> {/**Column 1 that will simply contain the logo of the landing page */}
            <img src="/logo.jpeg" className="logo" />
          </Col>
          <Col className="button-box"> {/**Column 2 that will simply contain the various options for logging in */}
            {/**Div to display the prompt for user to login in the landing page */}
            <Row className="header"> {/**Within the second column, we will have multiple rows */}
              <center><h1 className="title-content">Bored? Join Now!</h1></center>
            </Row>
            <Row className="login-buttons">
              <Button  className="google-button" variant="outline-primary" size="lg" onClick={handleGoogleLogin}> 

              <FontAwesomeIcon icon={faGoogle} size="sm" />
                <span style={{margin: '10px' }}>Sign in with Google</span>
  </Button>
  {/*}  
              <GoogleLogin 
                className="google-button"
                clientId="1000681390710-omq8f36aua0r1ih93p455d960ush5uou.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
  cookiePolicy={'single_host_origin'}/> */}
            </Row>
            <Row className="login-buttons">
              <Button className="apple-button" variant="outline-secondary" size="lg">
              <FontAwesomeIcon icon={faApple} size="lg" />
                 <span style={{margin: '10px'}}>Sign in with Apple</span>
              </Button>
            </Row>
            <Row className="login-buttons">
              {/**Div containing the login option for github */}
              <Button className="github-button" variant="outline-dark" size="lg">
              <FontAwesomeIcon icon={faGithub} size="lg" />
                <span style={{margin: '10px'}}>Sign in with Github</span>
              </Button>
            </Row>
            <Row className="login-buttons">
              {/**Div containing the option to login or sign up, user will be redirected to the authentication page */}
              <Button className="Authentication" variant="outline-info" size="lg" onClick={navigateToAuthentication}>Login/Register</Button>
            </Row>
            <Row className="login-button">
              <Button className="guest-button" variant="outline-warning" size="lg" onClick={navigateHome}>Continue As Guest
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Landing;