import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
type userdata1={
    user_id:number,
    name:string,
    phoneNumber:string,
    password:string,
    email:string|null,
}
type userdata2={ id: number; name: string; phoneNumber: string; ownerId: number; }
type userdata=userdata1|userdata2;

async function getStructuredDataForResponse(userData:userdata[]){
    const parsedData=[];
    for(let i=0;i<userData.length;i++){
        const currentValue=userData[i];
        const isSpam=await prisma.spam.findUnique({
            where:{
                phoneNumber:currentValue.phoneNumber,
                spamCount:{
                    gte:5
                }
            }
        });
        if(isSpam){
            parsedData.push({
                name:currentValue.name,
                phoneNumber:currentValue.phoneNumber,
                spam:true
            });
        }else{
            parsedData.push({
                name:currentValue.name,
                phoneNumber:currentValue.phoneNumber,
                spam:false
            });
        }
    }
    if(parsedData.length<=1) return parsedData;
    const cleanedParsedData=[parsedData[0]];
    for(let i=1;i<parsedData.length;i++){
        let notPresent=true
        for(let j=0;j<cleanedParsedData.length;j++){
            if(cleanedParsedData[j].name.toLowerCase()===parsedData[i].name.toLowerCase()&&cleanedParsedData[j].phoneNumber===parsedData[i].phoneNumber){
                notPresent=false;
            }
        }
        if(notPresent) cleanedParsedData.push(parsedData[i]);
    }
    return cleanedParsedData;
}

export default getStructuredDataForResponse;