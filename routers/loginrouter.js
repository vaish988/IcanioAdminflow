const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/login'); // Adjust the path accordingly
const hashGenerator=require('../helper/hashing.js');
const hashValidate=require('../helper/hashing.js');

// Login route
router.post('/login', loginUser);

module.exports = router;
