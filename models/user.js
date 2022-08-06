const { timeStamp } = require("console");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    role: {type: String, enum: ["user", "staff", "manager", "admin"], default: "user"},
    isAdmin: { type: Boolean, default: false},
    isStaff: { type: Boolean, default: false},
    isManager: { type: Boolean, default: false},
    token: { type: String },

  }, 
  { timeStamp: true }
);

module.exports = mongoose.model("user", userSchema);