const express = require('express');
const router = express.Router();

// Define your routes
router.get('/bookbike', (req, res) => {
    
    res.send('Home page');
});

router.get('/about', (req, res) => {
    res.send('About page');
});

// Export the router
module.exports = router;
