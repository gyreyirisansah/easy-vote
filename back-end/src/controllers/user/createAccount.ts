import { Request, Response } from "express";
import {createUser} from "../../db/user/userAccount"
import { addUserInfo } from "../../db/user/user";
import {saltAndHash} from "../auth/bcrypt_controller"
import { matchedData,validationResult } from 'express-validator';
import {getAuthenticatedUserDetails} from "../auth/token_controller"


import { baseAddress,baseEmail,basePhoneNo,baseNameValidator } from "../utils/base_validators";
import { isAuthenticated } from "../auth/auth";
import log4js from "log4js"
const logger = log4js.getLogger("app")
const err_logger = log4js.getLogger("errors")


export const addUserValidator =[
    ...baseNameValidator("firstname"),
    ...baseNameValidator("lastname"),
    ...baseEmail("email_address"),
    ...basePhoneNo("phone_no"),
    ...baseAddress("address"),
]

export const signup = async(req:Request, res:Response) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const {pass,username} = validatedData;
        
        const hashedPassword = saltAndHash(pass)
        try{
            await createUser(username,hashedPassword)
            logger.info("New user created");
            res.status(201).json({"message":"Account created successfully"})
        }catch(err){
            //TODO Log error
            err_logger.error("Error 500 at user creation");
            res.status(500).json({"error":true,"message":"An error occured while creating user"})
        }
    }    
}


export const addUserInfo_Cont = async(req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        isAuthenticated(req,res,async() =>{
            const validatedData = matchedData(req)
            const {firstname,lastname,email_address,phone_no,address} = validatedData;
            const token =  req.get("Authorization")?.split(" ")[1];
            const user = getAuthenticatedUserDetails(token||"",process.env.LOGIN_TOKEN_SECRET_KEY||"")
            const acc_id =  user?.acc_id;
            try{
                await addUserInfo(Number(acc_id),firstname,lastname,email_address,phone_no,address)
                //TODO Log user creation
                logger.info("New user details entered");
                res.status(201).json({"message":"Account created successfully"})
            }catch(err){
                //TODO Log error
<<<<<<< HEAD
                res.status(500).json({"error":true,"message":"An error occured while adding user info"})
=======
                err_logger.error("Error 500 at new user details entry");
                res.status(500).json({"error":true,"message":"An error occured while creating user"})
>>>>>>> da2166adc4e3581961d3e7bf6a72e78da54c2567
            }
            })
        
    }    
}

