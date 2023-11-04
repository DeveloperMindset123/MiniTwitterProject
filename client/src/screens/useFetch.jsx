/* eslint-disable no-unused-vars */
//useFetch.jsx file
import { response } from "express";
import { useState } from "react";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogle = async (response) => {
        console.log(response)
    };

    return {loading, error, handleGoogle};
}

export default useFetch;

