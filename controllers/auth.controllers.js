import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import genToken from "../config/token.js";

export const signUp= async (req, res) => {
    try {
        const {name,email,password} =req.body;

        const existEmail=await User.findOne({email});

        if(existEmail){
            return res.status(400).json({message:"Email already exists"});
        }
        
        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters!"})
        }

        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashPassword
        });

         const token=await genToken(user._id);

         res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000
            });
         
           return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message:"sign up error"});
        
    }
}

export const login= async (req, res) => {
    try {
        const {email,password} =req.body;

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Email doesn't exists"});
        }
        
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
       
         const token=await genToken(user._id);

         res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000
            });
         
           return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:"login error"});
        
    }
}

// logout
export const logOut= async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Logout successful"});
    } catch (error) {
        return res.status(500).json({message:"Logout error"});
    }
}
