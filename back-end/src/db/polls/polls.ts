import { connect } from "../db"
import { hasVoted } from "../votes/vote";


export const addPolls = async (title:string):Promise<number>=> {
    let db = await connect();

    await db.run(`
        INSERT INTO Polls
            (title, status)
        VALUES
            (?,?);
    `,[title, 1]
    );
    return getPollId(title)
}

export const addOptions = async (poll_id:number,option_name:string,option_image_url:string):Promise<void>=> {
    let db = await connect();

    await db.run(`
        INSERT INTO Options
            (poll_id, option_name,option_image_url)
        VALUES
            (?,?,?);
    `,[poll_id, option_name,option_image_url]
    );
}

export interface Option {
    option_id: number;
    option_name: string;
    option_image_url: string;
};

export interface Poll {
    title: string;
    options: Option[];
};
export interface PollResult {[key:string]:Poll}

export const getPolls = async (acc_id:number): Promise<PollResult> => {

        
    try{
        let db = await connect();
        let result: PollResult = {};
        const rows = await db.all(`
        SELECT polls.id AS poll_id, polls.title AS poll_title,options.id as option_id, 
            options.option_name AS option_name, options.option_image_url AS option_image_url
        FROM polls
        INNER JOIN options ON polls.id = options.poll_id
        WHERE polls.status = 1;`   
        );

        for(const row of rows){
            
            if (! (await hasVoted(acc_id,row.poll_id))){
                if (!result[row.poll_id]) {
                    // create a new object for the poll and add its title and options array
                    result[row.poll_id] = {
                        title: row.poll_title,
                        options: []
                    };
                }
                // add an object for the option to the poll's options array
                result[row.poll_id].options.push({
                    option_id: row.option_id,
                    option_name: row.option_name,
                    option_image_url: row.option_image_url
                });   
            }
        } 
        console.log("I did run before return statement")
        return result;
    }catch(err){
        throw new Error(""+err)
    }        
}

export const getPollsActive = async (): Promise<PollResult> => {

        
    try{
        let db = await connect();
        let result: PollResult = {};
        const rows = await db.all(`
        SELECT polls.id AS poll_id, polls.title AS poll_title,options.id as option_id, 
            options.option_name AS option_name, options.option_image_url AS option_image_url
        FROM polls
        INNER JOIN options ON polls.id = options.poll_id
        WHERE polls.status = 1;`   
        );

        for(const row of rows){
        
            if (!result[row.poll_id]) {
                // create a new object for the poll and add its title and options array
                result[row.poll_id] = {
                    title: row.poll_title,
                    options: []
                };
            }
                // add an object for the option to the poll's options array
            result[row.poll_id].options.push({
                option_id: row.option_id,
                option_name: row.option_name,
                option_image_url: row.option_image_url
            });   
        }
        return result;
    }catch(err){
        throw new Error(""+err)
    }        
}




export const getPollId = async (title: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Polls WHERE title = ?`, [title]);
    return result.id;
}
