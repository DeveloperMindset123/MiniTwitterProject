import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/*
const express = require('express');
const app = express();
const port = 3001;

// Add your Express server logic here

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); */


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/MiniTwitterProject/',
})
