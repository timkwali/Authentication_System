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
      // encryptedPassword = await bcrypt.hash(password, process.env.HASHING_SALT);
      const salt = await bcrypt.genSalt(10)
      encryptedPassword = await bcrypt.hash(password, salt);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email},
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      // save user token
      user.token = token;
      res.cookie(process.env.LOGIN_COOKIE, token);
  
      // return new user
      const newUser = { 
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        isManager: user.isManager,
        isStaff: user.isStaff,
        token: user.token,
      }
      res.status(201).json(newUser);
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
          { user_id: user._id, email},
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        );
  
        // save user token
        user.token = token;
        res.cookie(process.env.LOGIN_COOKIE, token);
  
        // user
        const newUser = { 
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          isManager: user.isManager,
          isStaff: user.isStaff,
          token: user.token,
        }
        res.status(200).json(newUser);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
};

const getLoggedInUser = async (req, res) => {
  try {
    const token = req.headers[process.env.TOKEN_HEADER_KEY]
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userEmail = decoded["email"]

    const user = await User.findOne({email: userEmail}).select("-password")
    return res.json({
      status: 200,
      message: "Operation Successful",
      body: user
    })

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
}

const logout = (req, res) => {
  res.clearCookie(process.env.LOGIN_COOKIE)
  res.status(200).json({
    status: 200,
    message: "Logout Successful"
  })
}

//Only Admins and managers should see list of users
const getListOfUsers = async (req, res) => {
  try {

    const token = req.headers[process.env.TOKEN_HEADER_KEY]
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userEmail = decoded["email"]
    const currentUser = await User.findOne({email: userEmail}).select("-password")

    if(currentUser.isAdmin || currentUser.isManager) {
      const userList = await User.find({type: this.type})
      if(userList) {
        return res.status(200).json({
          status: 200,
          message: "Operation Successful",
          data: userList
        })
      }

      return res.status(500).json({
        status: 500,
        message: "Error getting list of users",
      })

    } else {
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to do this operation!",
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
}

//Only Admin should be allowed to update User
const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email, isAdmin, isStaff, isManager } = req.body;
    const token = req.headers[process.env.TOKEN_HEADER_KEY]
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userEmail = decoded["email"]
    const currentUser = await User.findOne({email: userEmail}).select("-password")
    console.log(currentUser)

    if(currentUser.isAdmin == true) {
      const update = await User.replaceOne({email: email}, req.body)
      if(update) {
        return res.status(200).json({
          status: 200,
          message: "User updated successfully"
        })
      }
      return res.status(500).json({
          status: 500,
          message: "Error updating user",
      })

    } else {
      return res.status(401).json({
        status: 401,
        message: "You are not authorized to do this operation!",
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
}

// module.exports = app;
module.exports = {
  home,
  register,
  login,
  logout,
  getListOfUsers,
  getLoggedInUser,
  updateUser
}