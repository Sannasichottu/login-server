const express = require('express');
const authRoutes = express.Router();
const User = require('../models/User');
const {hashGenerate,hashValidator} = require('../helpers/hashing');
const {tokenGenerator} = require('../helpers/token');
const authVerify = require('../helpers/authVerify')

//Register
authRoutes.post("/register", async (req,res) => {
    try {
        const hashPassword = await hashGenerate(req.body.password)

    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword
    });
    const savedUser = await user.save();
    res.send(savedUser);
    } catch (error) {
        res.send(error);
    }

})

//Login
authRoutes.post("/login",async(req,res) => {
    try {
        const existingUser = await User.findOne({email:req.body.email});
    if(!existingUser) {
        res.send("Email is Invalid");
    }else {
        const checkUser = await hashValidator(req.body.password, existingUser.password)
        if(!checkUser) {
            res.send("Password is Invalid");
        }
        else {
            const token = await tokenGenerator(existingUser.email);
            res.cookie(
                "jwt",
                token,
                {httpOnly:true}
            )
            res.send(token)
        }
    }
    } catch (err) {
        res.send(err)
    }
})

authRoutes.get('/protected', authVerify ,(req,res) => [
    res.send("I am Protected route")
]);

authRoutes.get('/logout',(req,res) => {
    res.clearCookie("token")
    res.json({
        msg : "User Signout"
    })
})

module.exports = authRoutes;