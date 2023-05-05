// This module handles password validation and hassing of passwords.
import bcrypt from "bcryptjs";

export const saltAndHash =(pass:string): string=>{
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(pass,salt)
}

export const validatePassword = async(pass:string, savedHashedPass:string):Promise<boolean> =>{
    return bcrypt.compare(pass,savedHashedPass)
}