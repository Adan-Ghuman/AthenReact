import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetSuccessEmail, sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import {User} from "../models/user.model.js";


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password) 
            {
            throw new Error("Please fill all the fields");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success: false,message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            name, 
            email, 
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry: Date.now() + 74*60*60*1000 
        });

        await user.save();

        //jwt
        generateTokenAndSetCookie(res,user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({success: true, 
            message: "User created successfully",
        user: {
        ...user._doc,
        password: undefined,
    }});        
    } catch (error) {
        
        return res.status(400).json({success: false,message: error.message,});
        
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiry: { $gt: Date.now() },
        })

        if(!user) {
            return res.status(400).json({success:false, message:"Invalid or expired verification token"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({success:true, message:"Email verification successful", user:{
            ...user._doc,
            password: undefined
        }});
    } catch (error) {
        console.log("Error in Verify Email: ", error);

        res.status(500).json({success:false, message:"Server error"});
        
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;   
    
    try {

        const user = await User.findOne({email});
        if(!user){
            console.log("User not found");
            
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            console.log("Invalid password");
            
            return res.status(400).json({sucess:false, message:"Invalid credentials"});
        } 
        generateTokenAndSetCookie(res,user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({success:true, message:"Logged in successfully", user:{
            ...user._doc,
            password: undefined
        }});
        
    } catch (error) {
        console.log("Error in Login: ", error);
        
        res.status(400).json({success:false, message:error.message});
    }
}

export const logout = async (req, res) => {
    
    res.clearCookie("jwt");
    res.status(200).json({success:true, message:"Logged out successfully"});
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success: false, message: "User nor found"})
        }


        // generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");  
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000 ; //1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        //send email
        await sendResetPasswordEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success:true, message:"Password reset link sent to your email"});

    } catch (error) {
        console.log("Error in Forgot Password: ", error);
        
        res.status(400).json({success:false, message:error.message});
    }}

export const resetPassword = async (req, res) => {
        const { token, password } = req.body;
        try {
            const {token} = req.params;
            const {password} = req.body;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpiresAt: { $gt: Date.now() },
            });

            if(!user){
                return res.status(400).json({success:false, message:"Invalid or expired reset token"});
            }


            //Update Password
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;

            await user.save();

            await sendPasswordResetSuccessEmail({success:true, message:"Password reset successful"});

            res.status(200).json({success:true, message:"Password reset successful"});
        } catch (error) {

            console.log("Error in Reset Password: ", error);
            res.status(400).json({success:false, message:error.message});

        }
    }

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        console.log("req.userId: ", req.userId);
        
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        res.status(200).json({success:true, user:{
            ...user._doc,
            password: undefined
        }});
    } catch (error) {
        console.log("Error in Check Auth: ", error);
        res.status(400).json({success:false, message:error.message});
    }
}
