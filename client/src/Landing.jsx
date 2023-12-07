/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState }  from "react";
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider , useGoogleLogin, GoogleLogin } from "@react-oauth/google";
//import { Container, Row, Col, Button } from "react-bootstrap"; --> import them individually instead
import { faApple, faGithub, faGoogle, } from "@fortawesome/free-brands-svg-icons";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";  //the sun and moon icons are in this specific libraries
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css'; //NOTE: YOU MUST IMPORT THIS FOR BOOTSTRAP TO RENDER
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';  //note: initially the import statement was incorrect
import Row from 'react-bootstrap/Row';
import { ThemeContext, themes } from "./components/ThemeContext";  //import the two functions defined in ThemeContext
// import { MDBSwitch } from 'mdb-react-ui-kit';
import ThemeContextWrapper from "./components/ThemeContextWrapper";
import ToggleDark from './components/ToggleDark';
import '../src/styles/Landing.css'; //NOTE 2: STYLESHEET MUST BE PLACED AFTER BOOTSTRAP TO RENDER CORRECTLY



//this part of the website will have the typical landing page of twitter, but instead with our logo
//just follow this tutorial: https://www.sitepoint.com/google-auth-react-express/
function Landing() {

  //define a function that will handle light and dark mode
  const [darkMode, setDarkMode] = useState(true);  //we will use this to ensure that when a button is clicked, the light or dark mode of the background will be changed into

  //define the useNavigate function
  const navigate = useNavigate();

  const navigateToAuthenticationGoogle = async () => {  //if using await, the function needs to be async
    try {
      const response = await axios.get("http://localhost:4000/auth/google/success");
      console.log(response.data);  //will display the user's info
      //navigate to contacts
      navigate('/Auth');
    } catch (error) {
      console.error("Login failed", "error")
    }
  };

  
  const navigateHome = () => {
    //navigate to home
    navigate('/'); //this will allow the user to navigate back to the landing page
  }

  const navigateToAuthentication = () => {
    //navigate user to authentication
    navigate('/Auth');
  }

  const [user, setUser] = useState(null);


  return (

      <Container fluid>
        <Row>
          {/**We will be displaying the content within nested rows/columns */}
          <Col className="logo-box"> {/**Column 1 that will simply contain the logo of the landing page */}
            <img src="/logo.jpeg" className="logo" />
          </Col>
          <Col className="button-box"> {/**Column 2 that will simply contain the various options for logging in */}
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
            {/**Div to display the prompt for user to login in the landing page */}
            <Row className="header"> {/**Within the second column, we will have multiple rows */}
              <center><h1 className="title-content">Bored? Join Now!</h1></center>
            </Row>
            <Row className="login-buttons">
              <Button className="apple-button" variant="outline-primary" size="lg" href="http://localhost:4000/auth/google">
              <FontAwesomeIcon icon={faGoogle} size="lg" />
                 <span style={{margin: '10px'}}>Sign in with Google</span>
              </Button>
            </Row>
            <Row className="login-buttons">
              <Button className="apple-button" variant="outline-secondary" size="lg">
              <FontAwesomeIcon icon={faApple} size="lg" />
                 <span style={{margin: '10px'}}>Sign in with Apple</span>
              </Button>
            </Row>
            <Row className="login-buttons">
              {/**Div containing the login option for github */}
              <Button className="github-button" variant="outline-light" size="lg" href="http://localhost:4000/auth/github">
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
  )
}

export default Landing;

/**
 * Note from Ayan: The sign out animation can use some improvement. Additionally, it would look pretty nice if we have some kind of nice animation in the landing page, please implement this frontend team
 */