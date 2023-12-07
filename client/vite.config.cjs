import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/*
const express = require('express');
const app = express();
const port = 5172;

// Add your Express server logic here

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); */


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/MiniTwitterProject/',
  server: {
    port: 5173,  //this will specify the port number that we are working with
    open: '/Landing'  //this will specify the default page to be http://localhost:5173/Landing instead of http://localhost:5173
  }
})
