const express = require("express")
const bcrypt  = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cookieParser = require("cookie-parser")

const { blacklist } = require("../config/blacklist")

const {User} = require("../models/user.model")
const e = require("express")

const userRoute = express.Router()


userRoute.post("/login", async(req,res)=>{
    try{
        const {email, password} = req.body;
        const userCkeck = await User.find({email})
        if (!userCkeck) return res.send({"msg":"Please register your self"})
        else{
            bcrypt.compare(password, userCkeck[0].password, (err, result)=>{
                if (err) return res.send({"msg": "Wrong Credential"})
                else {
                    const token = jwt.sign({
                        userID: userCkeck[0]._id,
                        role: userCkeck[0].role,
                        name: userCkeck[0].name
                    }, process.env.secret, {
                        expiresIn: 60,
                    })

                    const refreshToken = jwt.sign({
                        userID: userCkeck[0]._id,
                        role: userCkeck[0].role,
                        name: userCkeck[0].name
                    }, process.env.refreshSecret, {
                        expiresIn: 300,
                    })
                    res.cookie("token", token)
                    res.cookie("refreshToken", refreshToken)
                    res.cookie("role", userCkeck.role)
                    return res.send({"msg":"Login Success", token, refreshToken, "role":userCkeck[0].role})
                }
            })
        }
    } catch(err){
        res.send({"msg": err})
    }
})

userRoute.post("/register", async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        const userCkeck = await User.find({email})
        if (userCkeck.length > 0) return res.send({"msg":"User exist, Please Login"})
        else {
            bcrypt.hash(password, 4, async function(err, hash) {
                if (err) return res.send({"msg":"Error while Hashing",err})
                else{
                    const registering = new User({name,email,password:hash,role})
                    await registering.save()
                    return res.send({"msg": "Register Success"})
                }
            });
        }
    } catch(err){
        res.send({"msg":"Catch block",err})
    }
})

userRoute.get("/refresh", async(req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken
        if (refreshToken){
            jwt.verify(refreshToken, process.env.refreshSecret, (err, decoded)=>{
                if (err) return res.send({"msg":"Please Login", err})
                else {
                    const token = jwt.sign({
                        userID: decoded.userID,
                        role: decoded.role,
                        name: decoded.name
                    }, process.env.secret, {
                        expiresIn: 60,
                    })
                    res.cookie("token", token)
                    return res.send({"msg": "Refresh Token Generation Success"})
                }
            })
        }
        return res.send({"msg":""})
    } catch(err){

    }
})

userRoute.get("/logout", (req,res)=>{
    const token = req.cookies.token
    blacklist.push(token)
    console.log(blacklist)
    return res.send({"msg": "Logout Success"})
})


module.exports = {
    userRoute
}
