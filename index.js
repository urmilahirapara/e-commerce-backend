const express = require("express");
const cors = require("cors");
require("./db/config");
const user = require("./db/User");
const Product = require("./db/product");

const jwt=require("jsonwebtoken");
const jwtkey='e-comm';

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let User = new user(req.body);
  let result = await User.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err)
    {
      response.send("something wrong");
    }
    res.send({result,auth:token});
  }) 
  
  //  res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let User = await user.findOne(req.body)
    .select("-password");
    if (User) {
      jwt.sign({User},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err)
        {
          response.send("something wrong");
        }
        res.send({User,auth:token});
      }) 
   
    } else {
      res.send("User not found");
    }
  } else {
    res.send("User not found");
  }
});
app.listen(5000);

app.post("/add_product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});
app.get("/products", async (req, res) => {
  let product = await Product.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send("product not found");
  }
});
app.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  let deleteid = await Product.deleteOne({ _id: id });
  res.send(deleteid);
});
app.get('/update/:id',async(req,res)=>{
  let id = req.params.id;
  let result = await Product.findOne({ _id: id });
  if (result) {
    res.send(result);
  } else {
    res.send("product not found");
  }
  
})
app.put('/update/:id',async (req,res)=>{
  let result=await Product.updateOne(
    {_id:req.params.id},
    {$set:req.body}
  )
  res.send(result);
})

app.get('/search/:key',async(req,res)=>{
  let result = await Product.find({
    "$or":[
      {name:{$regex:req.params.key}},
      {price:{$regex:req.params.key}},
      {category:{$regex:req.params.key}},
      {company:{$regex:req.params.key}}
    ]
  })
res.send(result);
})
