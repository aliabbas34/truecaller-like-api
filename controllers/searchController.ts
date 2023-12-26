import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import parseSearchValue from '../utils/parseSearchValue';
import getStructuredDataForResponse from '../utils/getStructuredDataForResponse';
const prisma = new PrismaClient();

const searchController=async(req:Request,res:Response)=>{
    try{
        const { value }=req.query;
        if(typeof value!='string') return res.status(400).json({message:"search value passed is not of type string"});
        const parsedValue=parseSearchValue(value);
        if(parsedValue.error) return res.status(500).json({message:"error while parsing value in backend"});
        if(parsedValue.isName){
            //search via name
            //name phoneNumber and spam Likelihood
            let userData=[];
            const startsWithDataFromUsersTable=await prisma.users.findMany({
                where:{
                    name:{
                        startsWith:parsedValue.value,
                        mode:'insensitive'
                    }
                }
            });
            const startsWithDataFromContactsTable=await prisma.contacts.findMany({
                where:{
                    name:{
                        startsWith:parsedValue.value,
                        mode:'insensitive'
                    }
                }
            });
            const containsDataFromUsersTable=await prisma.users.findMany({
                where:{
                    AND:[
                        {
                        NOT:{
                            name:{
                                startsWith:parsedValue.value,
                                mode:"insensitive"
                            }
                        },
                        },
                        {
                            name:{
                                contains:parsedValue.value,
                                mode:'insensitive'
                            }
                        }
                    ]
                }
            });
            const containsDataFromContactsTable=await prisma.contacts.findMany({
                where:{
                    AND:[
                        {
                        NOT:{
                            name:{
                                startsWith:parsedValue.value,
                                mode:"insensitive"
                            }
                        },
                        },
                        {
                            name:{
                                contains:parsedValue.value,
                                mode:'insensitive'
                            }
                        }
                    ]
                }
            });
            userData=[...startsWithDataFromUsersTable,...containsDataFromUsersTable,...startsWithDataFromContactsTable,...containsDataFromContactsTable];//this has all data in sequence except spam data.
            const data=await getStructuredDataForResponse(userData);//it contains parsed data with name, phoneNumber and spam fields,
            return res.status(200).json({message:"data fetch successfull",data:data});

        }
        if(parsedValue.isNumber){
            //search via number
            const userExist=await prisma.users.findUnique({
                where:{
                    phoneNumber:parsedValue.value
                }
            });
            if(userExist){
                const isSpam=await prisma.spam.findUnique({
                    where:{
                        phoneNumber:userExist.phoneNumber
                    }
                });
                if(isSpam){
                    const data=[{
                        name:userExist.name,
                        phoneNumber:userExist.phoneNumber,
                        spam:true
                    }];
                    return res.status(200).json({message:"data fetch successfull",data:data});
                }else{
                    const data=[{
                        name:userExist.name,
                        phoneNumber:userExist.phoneNumber,
                        spam:false
                    }];
                    return res.status(200).json({message:"data fetch successfull",data:data});
                }
            }else{
                const userDataFromContactTable=await prisma.contacts.findMany({
                    where:{
                        phoneNumber:parsedValue.value
                    }
                });
                const data=getStructuredDataForResponse(userDataFromContactTable);
                return res.status(200).json({message:"data fetch successfull",data:data});
            }
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server Error: error in search controller, check backend logs for more detail"});
    }
}

export default searchController;