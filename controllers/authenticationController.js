require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// importing user context
const User = require("../models/user");

const home = (req, res) => {
  return res.status(200).json({ 
      status: 200,
      message: "Welcome 🙌 to Authentication app!" 
  }) 
}

// Register
const register = async (req, res) => {
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      // save user token
      user.token = token;
      res.cookie('userToken', token)
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  };

// Login
const login = async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "10m" }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  };

const getListOfUsers = async (req, res) => {
  try {
    const userList = await User.find({type: this.type})
    if(userList) {
      return res.status(200).json({
        status: 200,
        message: "Operation Successful",
        data: userList
      })
    }
    return res.status(400).json({
        status: 500,
        message: "Error getting list of users",
    })
  } catch (err) {
    console.log(err);
  }
}

// module.exports = app;
module.exports = {
  home,
  register,
  login,
  getListOfUsers
}