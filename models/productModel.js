const mongoose = require('mongoose')

const productModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'product Name is required']
    },
    description:{
        type:String,
    },
    image:{
        type:String
    },
    price:{
        type:Number
    },
    stock:{
        type:Number
    },
    userCreated:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    userOrdered:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }

    
})

const product = mongoose.model('products',productModel)

module.exports = product