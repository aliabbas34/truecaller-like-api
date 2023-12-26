import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validate from '../utils/validate';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

const register=async(req:Request,res:Response)=>{
    try{
        const {name,phoneNumber,password,email}=req.body;

        if(!validate.nameValidation(name)){
            return res.status(400).json({message:'name value invalid'});
        }
        if(!validate.phoneNumberValidation(phoneNumber)){
            return res.status(400).json({message:'phone number value invalid'});
        }
        
        if(password.length<4){
            return res.status(400).json({message:'password length too short'});
        }
        
        //check if the number is already present in User table
        const user=await prisma.users.findUnique({
            where:{
                phoneNumber:phoneNumber
            }
        });
        if(user){
            return res.status(409).json({message:"This phoneNumber is already Registered"});
        }
        else{
            //hash password
            if(!process.env.SALT){
                return res.status(400).json({message:'Backend problem : SALT is missing'});
            }
            const hashedPassword=await bcrypt.hash(password,process.env.SALT);
            //create user
            const newUser=await prisma.users.create({
                data:{
                    name:name,
                    phoneNumber:phoneNumber,
                    password:hashedPassword,
                    email:email,
                }
            });
            //generate jwt token
            if(!process.env.SECRET){
                return res.status(403).json({message:'Backend problem : SECRET is missing'});
            }
            const token=jwt.sign({phoneNumber},process.env.SECRET);

            return res.status(200).json({message:"User created successfully",token:token});
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server Error! check register route logs'});
    }
}

const login=async(req:Request,res:Response)=>{
    try{
        const {phoneNumber, password}=req.body;

        const user=await prisma.users.findUnique({
            where:{
                phoneNumber:phoneNumber
            }
        });
        if(user){
            //hash password
            if(!process.env.SALT){
                return res.status(400).json({message:'Backend problem : SALT is missing'});
            }
            const hashedPassword=await bcrypt.hash(password,process.env.SALT);

            if(user.password===hashedPassword){
                if(!process.env.SECRET){
                    return res.status(403).json({message:'Backend problem : SECRET is missing'});
                }
                const token=jwt.sign({phoneNumber},process.env.SECRET);

                return res.status(200).json({message:"User logged in successfully",token:token});
            }else{
                return res.status(400).json({message:"wrong password"});
            }
        }else{
            return res.status(404).json({message:"phone number is not registered"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Intenal server Error! check login route logs"});
    }
}

export ={
    register,
    login
};