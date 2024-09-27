const axios = require('axios');
const db = require('../datastore/db'); // Import the database
const pterodactylConfig = require('../config/pterodactylConfig');
const crypto = require('crypto'); // For generating unique API keys

// Fetch user's servers from Pterodactyl API and pass them to the dashboard
exports.fetchServers = async (req, res, next) => {
    const apiKey = req.session.user?.apiKey; // Safely get the user's API key from the session

    if (!apiKey) {
        return res.status(401).render('error', { message: 'Unauthorized: No API key found.' });
    }

    try {
        const response = await axios.get(`${pterodactylConfig.apiUrl}/servers`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json'
            }
        });

        const servers = response.data.data;
        req.servers = servers || [];
        next(); // Pass servers to the next middleware
    } catch (error) {
        console.error('Error fetching servers:', error.response ? error.response.data : error.message);
        return res.status(500).render('error', { message: 'Error fetching servers' });
    }
};

// Render the dashboard with servers
exports.renderDashboard = (req, res) => {
    const servers = req.servers;
    const message = servers.length === 0 ? 'No servers have been created yet.' : null;

    res.render('dashboard', {
        user: req.session.user,
        servers: servers,
        message: message
    });
};

// Create a new server via Pterodactyl API
exports.createServer = async (req, res) => {
    const { name, description, eggId, nodeId, allocationId, environment } = req.body;
    const apiKey = req.session.user?.apiKey; // Safely get the user's API key from the session

    if (!apiKey) {
        return res.status(401).render('error', { message: 'Unauthorized: No API key found.' });
    }

    try {
        const response = await axios.post(`${pterodactylConfig.apiUrl}/servers`, {
            name: name,
            description: description,
            egg: eggId,
            node: nodeId,
            allocation: {
                default: allocationId
            },
            environment: environment
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
                'Content-Type': 'application/json'
            }
        });

        // After creation, redirect to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error creating server:', error.response ? error.response.data : error.message);
        return res.status(500).render('error', { message: 'Error creating server' });
    }
};

// Register a new user and generate a unique API key
exports.registerUser = (req, res) => {
    const { email, password } = req.body;
    const apiKey = crypto.randomBytes(20).toString('hex'); // Generate a unique API key

    // Store the new user in the database
    db.run(`INSERT INTO users (email, password, apiKey) VALUES (?, ?, ?)`, [email, password, apiKey], function(err) {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).render('error', { message: 'Error registering user' });
        }

        // Save the user and API key to the session
        req.session.user = { id: this.lastID, email: email, apiKey: apiKey };
        res.redirect('/dashboard');
    });
};