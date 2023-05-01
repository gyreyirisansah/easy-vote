import jwt, { JwtPayload } from "jsonwebtoken";

// export const validateToken =(token:string,secret:string) =>{
//     try{
//         return jwt.verify(token,secret)
//     }catch(err){
//         return {error: true, message:err}
//     }
// }

export const assignToken = (username:string,userId:number) => {
    const payload ={
        sub:userId,
        iss: "auth-service",
        user:username
    }
    const secret = process.env.LOGIN_TOKEN_SECRET_KEY||""
    return getToken(payload,secret)
}



const getToken =(payload:object, secret:string,options?:object) =>{
    if(!options){
        options = {expiresIn: '10m'}
        return jwt.sign(payload,secret,options)
    }
}

// export const getAuthenticatedUserDetails = (token:string) => {
//     const result = validateToken(token, process.env.LOGIN_TOKEN_SECRET_KEY||"");
//     if (result.name === "JsonWebTokenError") {
//       return null;
//     } else {
//       let authenticatedUser = {
//         acc_id: result.sub,
//         user: result.user,
//       };
//       return authenticatedUser;
//     }
//   };

  

export interface AuthenticatedUser {
  acc_id: number;
  user: string;
}

export function validateToken(token: string, secret: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload
  } catch (err) {
    return null;
  }
}

export function getAuthenticatedUserDetails(token: string, secret: string): AuthenticatedUser | null {
  const payload = validateToken(token, secret);
  if (!payload) {
    return null;
  }
  return {
    acc_id:     Number(payload.sub),
    user: payload.user as string,
  };
}