
function parseSearchValue(value:string){
    try{
        let allNumbers=true;
        for(let i=0;i<value.length;i++){
            const singleValue=value[i];
            const convertedValue=parseInt(singleValue);
            if(!(convertedValue<10&&convertedValue>=0)) allNumbers=false;
        }
        if(allNumbers&&value.length<=10){
            return {
                isNumber:true,
                isName:false,
                value:value,
                error:false
            }
        }
        else{
            return {
                isNumber:false,
                isName:true,
                value:value,
                error:false
            }
        }
    }catch(err){
        console.log(err);
        return {
            isNumber:false,
            isName:false,
            value:value,
            error:true
        }
    }
}

export default parseSearchValue;