
const mongoose=require('mongoose');


const captainSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:false
    }

})

const Captain=mongoose.model('Captain',captainSchema);
module.exports=Captain;