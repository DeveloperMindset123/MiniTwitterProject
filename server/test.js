import dotenv from 'dotenv/config'; // even tho its gray its needed
import { resolve } from 'path';
import { rejects } from 'assert';
import { error } from 'console';
// dotenv.config({path:'../'})
const apiKey = process.env.MONOGODB;
console.log(apiKey)