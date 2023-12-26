import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validate from '../utils/validate';

const prisma = new PrismaClient();

const updateEmail=async(req:Request,res:Response)=>{
    try{
        const { email } = req.body;

        if(!validate.emailValidation(email)){
            return res.status(400).json({message:"Validation failed: it is not a valid"});
        }

        const phoneNumber=req.headers.phoneNumber;

        if(typeof phoneNumber!= 'string'){
            return res.status(400).json({message:"Error while updating email because middleware did not put a string in phoneNumber header"});
        }
        if(!validate.phoneNumberValidation(phoneNumber)){
            return res.status(400).json({message:"phone number retrieved from jwt token is invalid hence email can't be updated"});
        }

        const updateUser=await prisma.users.update({
            where:{
                phoneNumber:phoneNumber
            },
            data:{
                email:email
            }
        });
        
        return res.status(200).json({message:"email updated successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Error while updating email check backend logs"});
    }
}

export default updateEmail;