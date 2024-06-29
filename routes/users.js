const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')


router.post('/create',async(req,res)=>{
  try{
    const {name,username,email,password} = req.body

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.create({name,username,email,password:hash})
    let token = jwt.sign({email},"asdfghj")
    res.cookie("token",token)
    res.send("user created")
    

  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

router.post('/login',async(req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    if(!user) res.send("something went wrong")

    const result = await bcrypt.compare(req.body.password,user.password)
    if(result){
      let token = jwt.sign({email:user.email},"asdfghj")
      res.cookie("token",token)
      res.send('user logged in')
    }else{
      res.status(500).json({ error: err.message });
    }
    
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

router.post('/logout',(req,res)=>{
  try{
    res.cookie("token","")
    res.send('logged out')
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

router.get('/delete/:id',async (req,res)=>{
  try{
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)
    const products = await user.populate('products')
    products.forEach((product)=>{
      res.redirect(`/products/delete/${product._id}`)
    })
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
