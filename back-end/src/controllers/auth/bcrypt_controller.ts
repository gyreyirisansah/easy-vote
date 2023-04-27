import bcrypt from "bcryptjs";

export const saltAndHash =(pass:string): string=>{
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(pass,salt)
}

export const validatePassword = async(pass:string, savedHashedPass:string) =>{
    return bcrypt.compare(pass,savedHashedPass)
}