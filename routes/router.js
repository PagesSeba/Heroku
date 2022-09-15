const router = require('express').Router();
const passport = require('passport');
const { getIndex, getLogin, getSignup, postLogin, postSignup, getFailLogin, getFailSignup, getLogout, failRoute } = require('../controllers/controller');
const { getInfo } = require ("../controllers/infoController.js");
const checkAuthentication = require('../middlewares/auth');
const { forkRandoms } = require("../controllers/forkController")


// Index
router.get('/', checkAuthentication, getIndex);


// Login
router.get('/login', getLogin);
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);
router.get('/faillogin', getFailLogin);

// Signup
router.get('/signup', getSignup);
router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), postSignup);
router.get('/failsignup', getFailSignup);

// Redirect to login & signup
router.post('/redirect-signup', (req, res) => res.redirect('/signup'));
router.post('/redirect-login', (req, res) => res.redirect('/login'));

// Info

router.get("/info" , getInfo)

// Random

router.get("/randoms", forkRandoms);

// Logout
router.post('/logout', getLogout);

// Fail route
router.get('*', failRoute);

module.exports = router;