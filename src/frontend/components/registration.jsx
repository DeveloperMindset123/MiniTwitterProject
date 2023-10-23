import React from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function Registration() {
//we will be creating the user registration or login here
  return (
    <>
      <FloatingLabel
        controlId='floatingInput'
        label="First Name" /**User will be asked to input first name */
        className='mb-3'
        >
            <Form.Control type="text" placeholder='Enter your first name' />
        </FloatingLabel>
        <FloatingLabel
            controlId='floatingInput'
            label="Last Name" /**User will be prompted for last name */
            className='mb-3'
        >
            <Form.Control type="text" placeholder='Enter your last name' />
        </FloatingLabel>
        <FloatingLabel
            controlId='floatingInput'
            label="Email Address"
            className='mb-3'>
            <Form.Control type='email' placeholder='name@example.com' />
        </FloatingLabel>
        <FloatingLabel
            controlId='floatingPassword'
            label="password">
            <Form.Control type='password' placeholder='Password' className='mb-3' />        
        </FloatingLabel>
    </>
  )
}

export default Registration;