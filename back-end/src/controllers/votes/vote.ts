import { matchedData, validationResult } from "express-validator";
import { Request, Response } from "express";
import { isAuthenticated } from "../auth/auth";
import { AuthenticatedUser, getAuthenticatedUserDetails } from "../auth/token_controller";
import { countVotes, countVotes_2, hasVoted, vote,VoteCount } from "../../db/votes/vote";
import log4js from "log4js"
import { baseAlphaNumeric, baseIdValidator } from "../utils/base_validators";
const logger = log4js.getLogger("app")
const err_logger = log4js.getLogger("errors")

export const castVoteValidator =[
    ...baseAlphaNumeric("title"),
    ...baseIdValidator("vote_casted"),
    ...baseIdValidator("poll_id")
]


export const castVote = async(req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        await isAuthenticated(req,res,async() =>{
            const validatedData = matchedData(req)
            const token =  req.get("Authorization")?.split(" ")[1];
            const user:AuthenticatedUser|null = getAuthenticatedUserDetails(token||"",process.env.LOGIN_TOKEN_SECRET_KEY||"")
            let acc_id = 0
            if (user){acc_id =  user.acc_id;}
            const {poll_id, title, vote_casted} = validatedData;
           
            try{
                if(await hasVoted(acc_id,poll_id)){
                    res.status(400).json({message:"User has already voted for this poll"});
                }else{
                    await vote(poll_id,vote_casted,acc_id)
                    //TODO Log vote casted successful message.
                    res.status(201).json({message:"Vote casted successfully for "+title})
                }
            }catch(err){
                //TODO Log error
                err_logger.error("Error 500 at new user details entry");
                res.status(500).json({"error":true,"message":"An error occured while creating poll "+title})
            }
            })
        
    }    
}

export const getAllVoteCount = async(req:Request, res:Response) => {
   
    await isAuthenticated(req,res,async() =>{
        try{    
            const votesCount:VoteCount = await countVotes_2()
            res.status(200).json({voteCounts:votesCount})
        }catch(err){
            //TODO Log error
            err_logger.error("Error in Vote Count: "+err);
            res.status(500).json({"error":true,"message":"An error occured while fetching vote counts"})
        }
    })
           
}