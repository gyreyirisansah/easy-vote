/*
    We adapted some codes form dead-drop user implementation.
*/
import { connect } from "../db"

export const userExists = async (username: string): Promise<boolean> => {
    let db = await connect();

    let query = "SELECT id FROM Accounts WHERE username = :username;"
    const result = await db.get(query, {
        ':username': username,
    });

    if(!(result === undefined)){
        return typeof result.id === "number";
    }else{
        return false;
    }
}

export const getUserId = async (username: string): Promise<number> => {
    let db = await connect();

    let result = await db.get(`
        SELECT id FROM Accounts
        WHERE username = :username;
    `, {
        ":username": username,
    });

    return result.id;
}

export const getUserPassHash = async (username: string): Promise<string> => {
    let db = await connect();
    if(await userExists(username)){
        let result = await db.get(`
        SELECT hash FROM Accounts
        WHERE username = :username;
    `, {
        ":username": username,
    });

        return result.hash;
    }
    //For logging purpose
    throw new Error("User does not exist")
    
}

export const createUser = async (username: string, hash: string): Promise<void> => {
    let db = await connect();

    await db.run(`
        INSERT INTO Accounts
            (username, hash)
        VALUES
            (:username, :hash);
    `, {
        ":username": username,
        ":hash": hash,
    });
}

export const isAdmin = async (acc_id: number): Promise<Boolean> => {
    let db = await connect();

    let result = await db.get(`
    SELECT COUNT(*) FROM Admins WHERE acc_id=?`,[acc_id]);

    return Promise.resolve(result['COUNT(*)'] > 0);
}


export const noAccounts = async (username:string): Promise<boolean> => {
    let db = await connect();
    let result = await db.get(`SELECT COUNT(*) FROM Accounts WHERE username= :username;`,{":username":username});
    return Promise.resolve(result['COUNT(*)'] === 0);
}