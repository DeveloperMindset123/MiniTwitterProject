/* eslint-disable no-undef */
//Signup.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from './useFetch';

//https://developers.google.com/identity/gsi/web/reference/js-reference

const SignUp = () => {
    const { handleGoogle, loading, error } = useFetch(
        "http://localhost:5173/signup"
    );

    useEffect(() => {
        /*global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogle,
            });

            google.accounts.id.renderButton(document.getElementById)
        }
    })
}