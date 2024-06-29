const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Product = require('../models/productModel')
const Auth = require('../middleware/auth')

var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });

router.get('/',async(req,res)=>{
    try{
        const products = await Product.find()
        res.send(products)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/create',Auth,async(req,res)=>{
    try{
        const {name,description,image,price,stock} = req.body
        const newProduct = await Product.create({name,image,description,price,stock,userCreated:req.user._id})
        await req.user.productCreated.push(newProduct._id)
        req.user.save()
        res.send('product created')

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/update/:id',Auth,async(req,res)=>{
    try{
        const {name,description,image,price,stock} = req.body
        const updatedProduct = {name,image,description,price,stock}
        
        await Product.findByIdAndUpdate(req.params.id,updatedProduct)
        res.send('product updated')

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.get('/delete/:id',Auth,async(req,res)=>{
    try{
        const {id} = req.params
        await Product.findByIdAndDelete(id)
        await req.user.productCreated.pull(id)
        req.user.save()
        res.send('product deleted')
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/addorder/:id',Auth,async(req,res)=>{
    try{
        const product =await Product.findById(req.params.id)
        await req.user.productOrdered.push(req.params.id)
        req.user.save()
        product.userOrdered = req.user._id
        await product.save()
        res.send('order added')
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/createorder',Auth, async(req, res) => {
    let amount = 0;
    const user = await req.user
    const products = await user.populate('productOrdered')
    products.productOrdered.forEach((product)=>{
        amount+= product.price
    })
    var options = {
      amount: amount * 100, // Amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
  
    instance.orders.create(options, function(err, order) {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(order);
    });
  });




module.exports = router;