//set up the authentication
import React, { useState } from 'react';
import '../styles/Auth.css';

export default function (props) {

    let [authMode, setAuthMode] = useState("signin");

    const changeAuthMode = () => { //set the logic for whether to sign in or register
        setAuthMode(authMode == "signin" ? "signup" : "signin")
    }

    if (authMode == 'signin') {
        return (
            <div className="Auth-form-container">
                <form className='Auth-form'>
                    <div className='Auth-form-content'>
                        <h3 className=''>Sign In</h3>
                        <div className='text-center'>
                            Not Registered Yet?{" "}
                            <span className='link-primary' onClick={changeAuthMode}>
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
        <div className='App Auth-form-container'>
            <form className='Auth-form'>
                <div className='Auth-form-content'>
                    <h3 className='Auth-form-title'>Sign In</h3>
                    <div className='form-group mt-3'>
                        <label>Email address</label>
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
                            placeholder='Enter password'
                        />
                    </div>
                    <div className='d-grid gap-2 mt-3'>
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                    </div>
                    <p className='forgot-password text-right mt-2'>
                        Forgot <a href='#'>password</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

//note: continue here --> https://www.codementor.io/@supertokens/building-a-login-screen-with-react-and-bootstrap-1sqpm1iszf