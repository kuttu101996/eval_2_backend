const jwt = require("jsonwebtoken")
require("dotenv").config();

const authentication = async(req,res,next)=>{
    try{
        const token = req.headers?.authorization?.split(' ')[1]
        if (!token) return res.send({"msg": "Please Login"})
        else {
            jwt.verify(token, process.env.secret, async(err,decoded)=>{
                if (err) return res.send({"msg":"Please Login", err})
                else {
                    req.body.userID = decoded.userID;
                    req.body.name = decoded.name;
                    req.body.role = decoded.role;
                    next()
                }
            })
        }
    } catch(err){
        return res.send({"msg":"Catch Block", err})
    }
}


module.exports = {
    authentication
}