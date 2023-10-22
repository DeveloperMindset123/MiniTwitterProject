import React from "react";
import '../frontend/styles/Landing.css';
import {useNavigate} from 'react-router-dom';
import { Container, Row, Col, Button } from "react-bootstrap";

//this part of the website will have the typical landing page of twitter, but instead with our logo

function Landing() {

  //define the useNavigate function
  const navigate = useNavigate();

  const navigateToAuthentication = () => {
    //navigate to contacts
    navigate('/Auth');
  };

  const navigateHome = () => {
    //navigate to home
    navigate('/Landing'); //this will allow the user to navigate back to the landing page
  }

  return (
    /**Note: Logo needs to be displayed on the left hand side whereas the login information should be displayed on the right hand side */
    <> {/**For simplicity, we will use an empty react tag for central tag */}
      <Container className="logo-box">
        {/**Div to display the logo on the left side */}
        <Row>
          {/**We will be displaying the content within nested rows/columns */}
          <Col> {/**Column 1 that will simply contain the logo of the landing page */}
            <img src="public\logo.jpeg" className="logo" />
          </Col>
          <Col> {/**Column 2 that will simply contain the various options for logging in */}
            {/**Div to display the prompt for user to login in the landing page */}
            <Row> {/**Within the second column, we will have multiple rows */}
              <h2>Bored? Join Now!</h2>
            </Row>
            <Row>
              <Button variant="outline-primary" size="lg">
                <img src="https://user-images.githubusercontent.com/1770056/58111071-c2941c80-7bbe-11e9-8cac-1c3202dffb26.png" alt="GoogleLogo" />
                Sign in with Google
              </Button>{' '}
            </Row>
            <Row>
              <Button variant="outline-light">
                <img src="https://media.designrush.com/inspiration_images/134802/conversions/_1511456315_653_apple-mobile.jpg" alt="AppleLogo" />
                Sign in with Apple
              </Button>
            </Row>
            <Row>
              {/**Div containing the login option for github */}
              <Button variant="outline-secondary">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GithubLogo" />
                Sign in with Github
              </Button>
            </Row>
            <Row>
              {/**Div containing the option to login or sign up, user will be redirected to the authentication page */}
              <Button variant="outline-info" onClick={navigateToAuthentication}>Login/Register</Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Landing;