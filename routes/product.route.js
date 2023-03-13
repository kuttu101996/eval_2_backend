const express = require("express")
const {authentication} = require("../middleware/authentication")
const {authorize} = require("../middleware/authorize")

const {Product} = require("../models/product.model")

const productRoute = express();

productRoute.get("/", authentication, async(req,res)=>{
    try{
        const products = await Product.find();
        return res.send({"msg": "All Products...........", products})
    } catch(err){
        res.send({"msg": "Catch Block", err})
    }
})

productRoute.post("/addproducts", authentication, authorize(["seller"]), async(req,res)=>{
    try{
        const newProduct = new Product(req.body)
        await newProduct.save()
        return res.send({"msg":"Product Added"})
    } catch(err){
        res.send({"msg":"Catch Block"})
    }
})

productRoute.delete("/deleteproducts/:id", authentication, authorize(["seller"]),  async(req,res)=>{
    try{
        const id = req.params.id;
        await Product.findByIdAndDelete({_id:id})
        return res.send({"msg": "Product Successfully Deleted"})
    } catch(err){
        res.send({"msg":"Catch Block"})
    }
})



module.exports = {
    productRoute
}