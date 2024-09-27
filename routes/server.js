const express = require('express');
const router = express.Router();
const pterodactylController = require('../controllers/pterodactylController');

// Route to render the form for creating a server
router.get('/create-server', (req, res) => {
    res.render('create-server');
});

// Route to handle the server creation logic via Pterodactyl API
router.post('/create-server', pterodactylController.createServer);

// Route to list servers on the dashboard
router.get('/dashboard', pterodactylController.fetchServers, pterodactylController.renderDashboard);

module.exports = router;
