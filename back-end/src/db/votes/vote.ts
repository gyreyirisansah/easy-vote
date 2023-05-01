import { connect } from "../db"
import crypto, { Hmac } from "crypto"
import {getPollsActive,PollResult } from "../polls/polls"

import log4js from "log4js"
const logger = log4js.getLogger("app")
const err_logger = log4js.getLogger("errors")


export const vote = async (poll_id:number,vote:number,acc_id:number):Promise<void>=> {
    let db = await connect();
    const hashedUser = getEncryptedUser(acc_id,vote);
    const mac = generateMac(poll_id,hashedUser,vote);

    await db.run(`
        INSERT INTO Votes
            (poll_id, user, vote, mac)
        VALUES
            (?,?,?,?);
    `,[poll_id, hashedUser,vote,mac]
    );

    await insertIntoVotedUsers(poll_id,acc_id)
}

const insertIntoVotedUsers = async (poll_id:number,acc_id:number) :Promise<void> =>{
    let db = await connect();
    const hashed_acc_id = encryptMessage(acc_id.toString())

    await db.run(`
        INSERT INTO Voted
            (acc_id, poll_id)
        VALUES
            (?,?);
    `,[hashed_acc_id, poll_id]
    );
}

export const hasVoted = async(acc_id:number, poll_id:number): Promise<boolean> =>{
    let db = await connect();
    const rows = await db.all(`
    SELECT acc_id FROM Voted WHERE poll_id=?`,[poll_id]); 
  
    for (const row of rows){
        const hashed_acc_id = row.acc_id
        const decrypted_acc_id = decryptMessage(hashed_acc_id)
        if (Number(acc_id) == Number(decrypted_acc_id)){
            return true;
        }
    }
    return false;
}


export interface Vote {
    title: string;
    invalidVotes:InvalidVote;
    options: Array<{
      option_name: string;
      option_id:number;
      option_image_url: string;
      votes: number;
    }>;
  };
  
  export interface InvalidVote {
    total_number: number;
    details: Array<{
      vote_Id: string;
      hashed_user: string;
      option_id:number;
      option_name: string;
    }>;
  };

export interface VoteCount {[key:string]: Vote};



export const getcountVotes= async(): Promise<VoteCount>=> {
    
    const polls: VoteCount = {};
    let db = await connect()
    await db.each(
        `
      SELECT
        polls.id AS poll_id,
        polls.title, 
        options.id AS option_id,
        options.option_name,
        options.option_image_url,
        COUNT(*) AS vote_count
      FROM votes 
      JOIN options ON votes.vote = options.id
      JOIN polls ON votes.poll_id = polls.id
      GROUP BY votes.poll_id, option_id;
    `,
    (err,row) =>{
        if(err){
            //TODO: Log error
            throw new Error(err)
        }
        const poll_id = row.poll_id;
        if (!polls[poll_id]) {
            polls[poll_id] = {
                title: row.title,
                invalidVotes:{
                    total_number:0,
                    details:[]
                },
                options: [],
            };
        }
        polls[poll_id].options.push({
            option_name: row.option_name,
            option_id: row.option_id,
            option_image_url: row.option_image_url,
            votes: row.vote_count,
        });
    });
    
    return polls;
}


export const countVotes = async(): Promise<VoteCount> => {

    const voteCount: VoteCount = await getcountVotes();
    const pollIds = Object.keys(voteCount);
    for (const pollId of pollIds) {
      const invalidVotes: InvalidVote = await getInvalidVotes(Number(pollId));
      const options = voteCount[pollId].options;
      for (const option of options) {
        const optionId = option.option_id;
        const invalidVotesForOption = invalidVotes.details.filter(iv => iv.option_id === optionId).length;
        option.votes -= invalidVotesForOption;
      }
      voteCount[pollId].invalidVotes = invalidVotes;
    }
    return voteCount;
  };


export const countVotes_2 = async():Promise<VoteCount> => {
    let votecounts:VoteCount = {}
    const activePolls:PollResult = await getPollsActive()

    for(const poll_id in activePolls){

        const poll_invalid_votes:InvalidVote =  await getInvalidVotes(Number(poll_id))

        votecounts[poll_id] = {
            title: activePolls[poll_id].title,
            options:[],
            invalidVotes:poll_invalid_votes
        }
        for(const option of activePolls[poll_id].options){
            const option_vote_count = await getVoteCountForOption(Number(poll_id),option.option_id)
            // const option_invalid_votes = await getInvalidVotesForOption(Number(poll_id),option.option_id)
            const invalidVotesForOption = poll_invalid_votes.details.filter(iv => iv.option_id == option.option_id).length
            const actual_votes = option_vote_count-invalidVotesForOption
            votecounts[poll_id].options.push({
                option_name:option.option_name,
                option_id: option.option_id,
                option_image_url:option.option_image_url,
                votes:actual_votes
            })

        }
    }
    return votecounts;
}

const getVoteCountForOption = async(poll_id:number,option_id:number): Promise<number> =>{
    let db = await connect()
    const row = await db.all(
        `
      SELECT COUNT(*) AS vote_count 
      FROM votes 
      WHERE poll_id =? AND vote =?;
    `,[poll_id,option_id]);
    if(row){
        return  row[0].vote_count
    }
    return 0
}

export const getInvalidVotesForOption = async(poll_id:number,option_id:number):Promise<number> =>{
    let db = await connect()
    let invalid_Votes:number =0;
    await db.each(
        `
      SELECT
        votes.id as vote_id,
        votes.user, 
        polls.id AS poll_id,
        polls.title, 
        options.id AS option_id,
        options.option_name
        FROM votes 
        JOIN options ON votes.vote = options.id
        JOIN polls ON votes.poll_id = polls.id
        WHERE polls.id = ? AND vote = ?
      `,[poll_id, option_id],
    (err,row) =>{
        if(err){
            //TODO: Log error
            throw new Error(err)
        }
        const oldMac = row.mac;
        const poll_id = row.poll_id;
        const hashed_user = row.user
        const vote = row.vote;
        const newMac = generateMac(poll_id,hashed_user,vote)

        if(!isValidVote(newMac,oldMac)){
            invalid_Votes += 1
        }
    });
    return invalid_Votes
}


export const getInvalidVotes = async(poll_id:number):Promise<InvalidVote> =>{
    let db = await connect()
    let invalid_Votes:InvalidVote ={total_number:0,details:[]};
    await db.each(
        `
      SELECT
        votes.id as vote_id,
        votes.user,
        votes.vote, 
        votes.mac,
        polls.id AS poll_id,
        polls.title, 
        options.id AS option_id,
        options.option_name
        FROM votes 
        JOIN options ON votes.vote = options.id
        JOIN polls ON votes.poll_id = polls.id
        WHERE polls.id = ?
      `,[poll_id],
    (err,row) =>{
        if(err){
            //TODO: Log error
            throw new Error(err)
        }
        const oldMac = row.mac;
        const poll_id = row.poll_id;
        const hashed_user = row.user
        const vote = row.vote;
        const newMac = generateMac(poll_id,hashed_user,vote)

        if(!isValidVote(newMac,oldMac)){
            invalid_Votes.total_number +=1
            invalid_Votes.details.push(
            {
                vote_Id: row.vote_id,
                hashed_user: hashed_user,
                option_id:row.option_id,
                option_name: row.option_name
            })
        }
    });
    return invalid_Votes
}


const getEncryptedUser = (acc_id:number,vote:number) =>{
    const salt = crypto.randomBytes(16).toString("hex");
    const data = acc_id+salt+vote
    return crypto.createHash("sha256").update(data).digest('hex');
}

const generateMac = (poll_id:number,hashed_user:string, vote:number) =>{
    const hmac_key = process.env.LOGIN_TOKEN_SECRET_KEY||""
    return crypto.createHmac("sha256",hmac_key+poll_id)
        .update(hashed_user+vote)
        .digest("hex");
}

const isValidVote = (newMac:string, oldMac:string) =>{
    return newMac==oldMac
}

const getSecretKey = (key:string) =>{
    return crypto.scryptSync(key, "salt", 24);
}

const encryptMessage = (message:string) =>{
    const initial_vector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(process.env.ALGORITHM||"", getSecretKey(process.env.SECURITY_KEY||""),initial_vector);
    const encryptedMesage = cipher.update(message, "utf8", "hex");
    const finalEncryptedMsg = [
        encryptedMesage + cipher.final("hex"),
      Buffer.from(initial_vector).toString("hex"),
    ].join("|");
    return finalEncryptedMsg
}

const decryptMessage = (encryptedMessage:string) =>{
    try{
        const [encryptedMsg, initial_vector] = encryptedMessage.split("|");
        if (!initial_vector) throw new Error("Initial Vector not found");
        const decipher = crypto.createDecipheriv(
            process.env.ALGORITHM||"",
            getSecretKey(process.env.SECURITY_KEY||""),
          Buffer.from(initial_vector, "hex")
        );
        return decipher.update(encryptedMsg, "hex", "utf8") + decipher.final("utf8");
    }catch(error){
        err_logger.error("Could not decrypt message, Cyphertext might have changed.")
        return ""
    }
        
      
}