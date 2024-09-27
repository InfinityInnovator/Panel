const bcrypt = require('bcrypt');
const User = require('../models/User');

// Render login page
exports.getLogin = (req, res) => {
    res.render('login');
};

// Render register page
exports.getRegister = (req, res) => {
    res.render('register');
};

// Handle user registration
exports.postRegister = async (req, res) => {
    const { email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(email, hashedPassword);
    User.create(user, (err) => {
        if (err) {
            return res.status(500).render('error', { message: 'Error registering user' });
        }
        res.redirect('/login');
    });
};

// Handle user login
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, user) => {
        if (err || !user) {
            return res.status(400).render('error', { message: 'Invalid email or password' });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).render('error', { message: 'Invalid email or password' });
        }

        // Store user ID in session
        req.session.userId = user.id;

        // Redirect the user to the dashboard after successful login
        res.redirect('/dashboard');
    });
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// Render profile page
exports.getProfile = (req, res) => {
    const userId = req.session.userId;
    
    User.findById(userId, (err, user) => {
        if (err || !user) {
            return res.status(404).render('error', { message: 'User not found' });
        }
        res.render('profile', { user });
    });
};
