   // /Users/hasnainalam/weblike/hashweblix19aug-main/src/models/userModel.js
   import mongoose from 'mongoose';

   // Define the user schema
   const userSchema = new mongoose.Schema({
       username: {
           type: String,
           required: true,
       },
       email: {
           type: String,
           required: true,
           unique: true, // Ensure email is unique
       },
       password: {
           type: String,
           required: true,
       },
       isVerified: {
           type: Boolean,
           default: false, // Default to false until verified
       },
       otp: {
           type: String, // Field to store OTP
           default: null, // Default to null if no OTP is set
       },
       otpExpiry: {
           type: Date, // Field to store OTP expiry time
           default: null, // Default to null if no expiry is set
       },
       isAdmin: {
           type: Boolean,
           default: false, // Default to false for regular users
       },
       forgotPasswordToken: {
           type: String, // Field to store forgot password token
           default: null, // Default to null if no token is set
       },
       forgotPasswordTokenExpiry: {
           type: Date, // Field to store forgot password token expiry time
           default: null, // Default to null if no expiry is set
       },
       verifyToken: {
           type: String, // Field to store verification token
           default: null, // Default to null if no token is set
       },
       verifyTokenExpiry: {
           type: Date, // Field to store verification token expiry time
           default: null, // Default to null if no expiry is set
       },
   }, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

   // Check if the model already exists to prevent overwriting
   const User = mongoose.models.User || mongoose.model('User', userSchema);

   export default User;
