const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors({
  origin: "*",
}));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://food-metro.vercel.app/');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running")
});


//signUp
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel
  .findOne({ email: email })
  .then((result) => {
    if (result) {
      res.send({ message: 'Email id is already registered', alert: false });
    } else {
      const data = new userModel(req.body);
      return data.save();
    }
  })
  .then(() => {
    res.send({ message: 'Successfully signed up', alert: true });
  })
  .catch((err) => {
    console.log(err);
    res.send({ message: 'Error occurred', alert: false });
  });
});

//api LogIn
app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: email })
  .then((result) => {
    // , (err, result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  }).catch((err) => {
    console.log(err);
    res.send({ message: 'Error occurred', alert: false });
  });;
});


//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)


//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message : "Upload successfully"})
})

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})



//server is running
app.listen(PORT, () => console.log("Server is running at port : " + PORT));
 
module.exports = app;