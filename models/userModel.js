const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is Required"],
        minLength:[2,"name must be 2 character long"],
        trim:true 
     },
     username:{
         type:String,
        required:[true,"name is Required"],
        minLength:[2,"name must be 2 character long"],
        unique:true,
        trim:true 
     },
     email:{
         type:String,
         required:[true,"email is Required"],
         trim:true,
         unique:true,
         RegExp:['/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/',"Email must be correct"]
      },
      password:{
        type:String
      },
      productCreated:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
      }],
      productOrdered:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
      }]
})

const user = mongoose.model('users',userModel)

module.exports = user