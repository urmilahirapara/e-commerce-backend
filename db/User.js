const mongoose=require('mongoose');
const sc=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
module.exports=mongoose.model("users",sc);