import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const verifyToken=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers["authorization"];

        if(!authHeader){
            return res.status(400).json({message:"authorization header not sent from frontend"});
        }

        const token=authHeader.split(' ')[1];

        if(!process.env.SECRET){
            return res.status(403).json({message:"secret string missing"});
        }

        jwt.verify(token,process.env.SECRET,async (err,data)=>{
        if(err){
            return res.status(500).json({error:err,message:"error in verifying jwt"});
        }
        else{
            if(!data){
                return res.status(404).json({message:"No data found in jwt"});
            }
            if(typeof data === "string"){
                return res.status(403).json({message:"data is of type string, jwt payload expected"});
            }
            const phoneNumber=data.phoneNumber;
            const userExist=await prisma.users.findUnique({
                where:{
                    phoneNumber:phoneNumber
                }
            });
            if(userExist){
                req.headers["phoneNumber"]=userExist.phoneNumber;
                next();
            }
            else{
                return res.status(404).json({message:"Access denied : User not found in database"});
            }
        }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error: check logs of authentication middleware"});
    }
}

export default verifyToken;
