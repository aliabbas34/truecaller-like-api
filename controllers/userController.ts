import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validate from '../utils/validate';

const prisma = new PrismaClient();

const userController=async(req:Request,res:Response)=>{
    try{
        const { name,phoneNumber,spam }=req.query;
        const currentUserPhoneNumber=req.headers.phoneNumber;
        if(typeof phoneNumber!= 'string'){
            return res.status(400).json({message:"Error while fetching user data because the phoneNumber sent via query from frontend is not a string."});
        }
        if(typeof name!= 'string'){
            return res.status(400).json({message:"Error while fetching user data because the name sent via query from frontend is not a string."});
        }
        if(!validate.phoneNumberValidation(phoneNumber)){
            return res.status(400).json({message:"phone number invalid"});
        }
        if(!validate.nameValidation(phoneNumber)){
            return res.status(400).json({message:"name invalid"});
        }
        if(typeof currentUserPhoneNumber!= 'string'){
            return res.status(400).json({message:"Error while fetching user data because the currentUserPhoneNumber set as an header from jwt token is not a string."});
        }
        if(!validate.phoneNumberValidation(currentUserPhoneNumber)){
            return res.status(400).json({message:"current user's phone number invalid"});
        }
        const userRegistered=await prisma.users.findUnique({
            where:{
                phoneNumber:phoneNumber,
                name:name,
            }
        });
        if(userRegistered){
            const userInContactList=await prisma.contacts.findMany({
                where:{
                    ownerId:userRegistered.user_id,
                    phoneNumber:{
                        equals:currentUserPhoneNumber
                    }
                }
            });
            if(userInContactList){
                const data={
                    name:name,
                    phoneNumber:phoneNumber,
                    email:userRegistered.email,
                    spam:spam
                }
                return res.status(200).json({message:"data fetch successfull",data:data});
            }else{
                const data={
                    name:name,
                    phoneNumber:phoneNumber,
                    spam:spam
                }
                return res.status(200).json({message:"data fetch successfull",data:data});
            }
        }else{
            const data={
                name:name,
                phoneNumber:phoneNumber,
                spam:spam
            }
            return res.status(200).json({message:"fetch successfull",data:data});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error: error occured in userController, check backend logs for more details"});
    }
}

export default userController;