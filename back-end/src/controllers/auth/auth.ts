import {Request, Response} from 'express'
import {validateToken, assignToken} from "./token_controller"


import {getUserId,getUserPassHash} from "../../db/user/userAccount"
import {validatePassword} from "./bcrypt_controller"
import { matchedData,validationResult } from 'express-validator';

import {baseNormalText,baseAlphaNumeric} from "../utils/base_validators"

export const loginValidator = [
    ...baseAlphaNumeric("username"),
    ...baseNormalText("pass")
]


export const isAuthenticated = async(req:Request,res:Response, success:Function) =>{
    const token =  req.get("Authorization")?.split(" ")[1]
    const result = validateToken(token||"", process.env.LOGIN_TOKEN_SECRET_KEY||"")
    if(!result){
        //TODO: Log error to log file
        res.status(403).json({message:"Unauthorized"})
    }else{
        return success()
    }
}

export const login = async(req:Request, res:Response) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const {pass,username} = validatedData;
        const hashedPassword = await getUserPassHash(username)
        if(await validatePassword(pass,hashedPassword)){
            const userId = await getUserId(username);
            const token = assignToken(username,userId);
            res.status(200).json({token:token});
        }else{
            res.status(401).json({error:"Authentication failed"});
        }
    }
    
    
}