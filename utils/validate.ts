const nameValidation=(value:string):boolean=>{
    if(value.length<=0) return false;
    return true;
}

const phoneNumberValidation=(value:string):boolean=>{
    if(value.length<10||value.length>10) return false;
    for(let i=0;i<value.length;i++){
        const singleValue=value[i];
        const convertedValue=parseInt(singleValue);
        if(!(convertedValue<10&&convertedValue>=0)) return false;
    }
    return true;
}

const emailValidation=(value:string):boolean=>{
    if(value.length<10) return false;
    let atCounter=0;
    for(let i=0;i<value.length;i++){
        if(value[i]==='@') atCounter++;
    }
    const emailElements=value.split('.');
    let dotPresent=false;
    if(emailElements.length>1){
        const lastValue=emailElements[emailElements.length-1];
        const dotIndex=(value.length-1)-lastValue.length;
        if(value[dotIndex]==='.') dotPresent=true;
    }
    if(atCounter>1||dotPresent===false) return false;
    return true;
}

export={
    nameValidation,
    phoneNumberValidation,
    emailValidation,
}
