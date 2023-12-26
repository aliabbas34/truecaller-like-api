import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validate from '../utils/validate';

const prisma = new PrismaClient();

const spamController=async (req:Request,res:Response)=>{
    try{
        const { phoneNumber }=req.body;
        if(typeof phoneNumber!= 'string'){
            return res.status(400).json({message:"Error while marking the phoneNumber spam because the phoneNumber sent via query from frontend is not a string."});
        }
        if(!validate.phoneNumberValidation(phoneNumber)){
            return res.status(400).json({message:"phone number invalid"});
        }
        const currentUserPhoneNumber=req.headers.phoneNumber;
        if(!currentUserPhoneNumber) return res.status(404).json({message:"Error in spam controller, current User's phone number not found in req header"});
        if(typeof currentUserPhoneNumber!='string') return res.status(404).json({message:"Error in spam controller, current User's phone number found in req header is not a string"});
        const currentUser=await prisma.users.findUnique({
            where:{
                phoneNumber:currentUserPhoneNumber
            }
        });

        if(!currentUser) return res.status(404).json({message:"Error in spam controller, user not found"});
        const id=currentUser.user_id;

        const isAlreadySpam=await prisma.spam.findUnique({
            where:{
                phoneNumber:phoneNumber
            }
        });
        
        if(isAlreadySpam){
            let userAlreadySpammedNumber=true;
            if(isAlreadySpam.spammedBy.indexOf(id)===-1) userAlreadySpammedNumber=false;
            if(userAlreadySpammedNumber){
                return res.status(200).json({message:"The number is already been spammed by user"});
            }
            else{
                const updatedSpamCount=isAlreadySpam.spamCount+1;
                const updatedSpammedBy=isAlreadySpam.spammedBy;
                updatedSpammedBy.push(id);
                const updateSpam=await prisma.spam.update({
                    where:{
                        phoneNumber:phoneNumber,
                    },
                    data:{
                        spamCount:updatedSpamCount,
                        spammedBy:updatedSpammedBy
                    }
                });
            }
        }else{
            const newSpam=await prisma.spam.create({
                data:{
                    phoneNumber:phoneNumber,
                    spamCount:1,
                    spammedBy:[id]
                }
            });
        }
        return res.status(200).json({message:"marked the number as spam successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error: error in spam controller check backend logs for more details"});
    }
}

export default spamController;
