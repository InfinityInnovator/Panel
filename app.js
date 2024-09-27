const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const db = require('./datastore/db');

// Body parser and session middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: '4t4wf4wrw34r3wr8ue8ujeuj12e92', resave: false, saveUninitialized: true }));

// Static files and views setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/server');

// Use routes
app.use('/', authRoutes);
app.use('/', serverRoutes);

// Default route (e.g., homepage or dashboard)
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');  // Redirect to dashboard if user is logged in
    } else {
        res.redirect('/login');      // Redirect to login if not logged in
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
