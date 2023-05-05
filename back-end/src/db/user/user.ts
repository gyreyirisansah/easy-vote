import { connect } from "../db"

// This modulle allowed us to insert user information for testing.

export const addUserInfo = async (acc_id:number, firstname:string,lastname:string,
    email_address:string,phone_no:string,address:string):Promise<void>=> {
    let db = await connect();

    await db.run(`
        INSERT INTO Users
            (acc_id, firstname,lastname,email_address,phone_no,address)
        VALUES
            (?,?,?,?,?,?);
    `,[acc_id, firstname,lastname,email_address,phone_no,address]
    );
}

export const getUserByAccId =async(acc_id:number):Promise<object> => {
    let db = await connect();
    const result = await db.get(`SELECT * FROM Users WHERE acc_id =?`,[acc_id])
    return {
        id:result.id,
        firstname:result.firstname,
        lastname:result.lastname,
        email_address:result.email_address,
        phone_no:result.phone_no,
        address:result.address
    }
}