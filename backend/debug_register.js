const mongoose = require('mongoose');
const User = require('./model/User');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
    
    const email = "Hello@gmail.com";
    const password = "admin989";
    
    console.log("Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }
    
    console.log("Creating user...");
    const user = new User({ email, password });
    await user.save();
    console.log("User saved successfully");
    
  } catch (err) {
    console.error("Registration error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
