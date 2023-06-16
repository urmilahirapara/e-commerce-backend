const mongoose=require('mongoose');
const sc=new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userId:String,
    company:String
});
module.exports=mongoose.model("products",sc);