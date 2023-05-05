import { Request, Response } from "express";
import {addPolls,addOptions,getPolls,PollResult,Poll} from "../../db/polls/polls"

import { check, matchedData,validationResult } from 'express-validator';   
import {AuthenticatedUser, getAuthenticatedUserDetails} from "../auth/token_controller"


import { localPathDir, baseAlphaNumeric } from "../utils/base_validators";
import { isAuthenticated, isAuthenticatedAndAdmin } from "../auth/auth";
import log4js from "log4js"
const logger = log4js.getLogger("app")
const err_logger = log4js.getLogger("errors")


export const addPollValidator =[
    ...baseAlphaNumeric("title"),
    check("options")
        .isArray({min:1})
        .withMessage("Poll should have at least one option"),
    ...baseAlphaNumeric("options.*.option_name"),
    ...localPathDir("options.*.option_image_url")
]



export const createPolls = async(req:Request, res:Response)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        err_logger.error("Error 400, Bad inputs entered during poll creation");
        res.status(400).json(errors.array());
    }else{
        await isAuthenticatedAndAdmin(req,res,async() =>{
            const validatedData = matchedData(req)
            const {title,options} = validatedData as Poll;
            try{
                const poll_id = await addPolls(title)
                options.forEach(async option => {
                    const optionName = option.option_name;
                    const optionImagUrL = option.option_image_url;
                    await addOptions(poll_id,optionName,optionImagUrL)
                });
                //TODO Log user creation
                logger.info("Poll"+title+" created successfully");
                res.status(201).json({"message":"Poll created successfully"})
            }catch(err){
                //TODO Log error
                err_logger.error("Error 500 at new user details entry");
                res.status(500).json({"error":true,"message":"An error occured while creating poll "+title})
            }
            })
        
    }    
}

export const getActivePolls =async(req:Request,res:Response) =>{
    await isAuthenticated(req,res, async() =>{
        try{
            const token =  req.get("Authorization")?.split(" ")[1];
            const user:AuthenticatedUser|null = getAuthenticatedUserDetails(token||"",process.env.LOGIN_TOKEN_SECRET_KEY||"")
            let acc_id = 0
            if (user){acc_id =  user.acc_id;}
            const polls:PollResult =await getPolls(acc_id)
            res.status(200).json({polls:polls})
        }catch(err){
            //TODO: Log fetching polls error
            res.status(500).json({"error":true,"message":"An error occured while fetching polls"})
        }
        

    })
}

