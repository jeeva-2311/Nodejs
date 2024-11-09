const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
    .then(user => {
        if (!user) {
            // If no user is found with that email
            return res.status(401).json({ message: "Auth failed" });
        }
        // If user exists, compare passwords
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Auth failed", error: err });
            }
            
            if (result) {
                // If password matches
                const token = jwt.sign({
                    email: user.email,
                    _id: user._id
                    },
                    "secret", 
                    { expiresIn: "1h" } 
                );
                return res.status(200).json({ 
                    message: "Auth successful", 
                    token: token
                });
            } else {
                // If password does not match
                return res.status(401).json({ message: "Auth failed" });
            }
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
    });
}

const signup = (req, res, next) => {
    // Check if a user with the same email already exists
    User.findOne({ email: req.body.email }).exec()
    .then(user => {
        if (user) {
            res.status(409).json({ message: 'User already exists' });
        } else {
            // If user doesn't exist, hash the password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: "user creation failed", error: err });
                } else {
                    // Create a new user with the hashed password
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(), 
                        email: req.body.email, 
                        password: hash 
                    }); 
                    
                    // Save the new user to the database
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User is created',
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: err });
                    });
                }
            });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
    });
}

const delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
}

module.exports = { login, signup, delete_user};