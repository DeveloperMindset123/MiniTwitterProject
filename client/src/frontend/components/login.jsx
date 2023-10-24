import React from 'react';
import FloatingLabel  from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

//This component will be used for login
const Login = () => {
  return (
    <>
        <FloatingLabel
            controlId='floatingInput'
            label="Email Address"
            className='mb-3'
        >
            <Form.Control type='email' placeholder='name@example.com' />
        </FloatingLabel>
        <FloatingLabel controlId='floatingPassword' label="Password">
            <Form.Control type="password" placeholder='Enter your Password' className='mb-3' />
        </FloatingLabel>
    </>
  );
};

export default Login;