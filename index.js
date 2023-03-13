const express = require("express")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")

const {connection} = require("./db")
const {userRoute} = require("./routes/user.route")
const {productRoute} = require("./routes/product.route")

const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use("/user", userRoute)
app.use("/products", productRoute)


app.get("/", (req,res)=>{
    return res.send({"msg": "Hello There! \nWelcome to Home Page"})
})


app.listen(process.env.port, async()=>{
    try{
        await connection
        console.log("connected to DB")
    } catch(err){
        console.log(err)
    }
    console.log("Server at 8080")
})