var express = require('express');
const User = require('../models/User');      // for Schema
require('../models/config')     // database func
var router = express.Router();
const { body, validationResult } = require('express-validator')     // for middleware
let jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')      // for password salting
const JWT_SECRET = "simpleSecrettoken"  // for auth token



router.post('/signup', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),    // this is middleware for correct credentials
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);   // if name ,email, password is not written properly it shows error

    // if there are errors , return bad request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check wheather the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" });
        }

        // salting to convert user password into has so we store in Database
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new User in database
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        // payload is created by user id 
        // warning ******* do not create payload by user password or name
        const data = {
            user: {
                id: user.id
            }
        }
        // provide auth token for user
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occureed")
    }
})


router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),

], async (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;

        // verify valid token
        // jwt.verify(req.get("token"), JWT_SECRET);

        // check user found in database
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "no user found with this email" })
        }
        // decrypt database password and compare with user logged in password
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            return res.status(400).json({ error: "invalid password" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        // provide auth token for user
        const authToken = jwt.sign(data, JWT_SECRET);
        let success = true
        res.json({ success , authToken })

    } catch (e) {
        res.send(e)
    }
})


module.exports = router


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkMDE2NzNlOWQ4YWM4OTFhNTM1N2ZjIn0sImlhdCI6MTY5MTM1ODgzNX0.pXPMVBCW-twHxGExlxCcrOBl2p5XwUEY1OYx34Dq3VI