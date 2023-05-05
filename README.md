# easy-vote
This simple application allows members of an organization, club, or student association to vote on various topics or polls.  

## Relevance
- Ensures anonymous voting  
- Ensures integrity of votes  
- Real-time counting of votes  

## Scope and Assumptions
- User accounts are managed by the mother institution and assumed to be secured.  

## Project Architecture and High Level Sketch
### Data Flow from Front-end to Back-end
- User input validated data are validated with YUP  
- Authentication token passed is passed as headers of the request.  
- Request body data is validated with an express-validator to ensure data matches a particular type. The express validator also escapes all input data to prevent any form of injection attack.  
- If the request body passes the test, the request is routed through another authenticated middleware that validates the request token to ensure the user is authorized to access the requested resources.  
- Request proceeds to a successful callback function if the user is authorized.  

### Data Flow from back-end to Front-end
- If the user request is authentic and successful, the particular success function implemented fetches the data from the DB, maps it to the defined types of the requested resource, and sends the response to the user.  

### Anonymous Voting
- To ensure anonymous voting, the user acc_id and the vote the user cast are hashed. We generated a random salt attached to the acc_id and the vote to prevent a brute-force attack from identifying user votes. Therefore the hashed data includes a Random salt + vote + acc id.  


## Vote Integrity
- To ensure the integrity of votes, we generate an HMAC for each vote using the poll id as the key. To prevent data modification attacks where the attacker inserts similar HMAC and votes into the database, we added a key saved in the environment variable to the poll id as the key. This ensures that inserted data would be rejected. (key: poll id + HMAC key, data: hashed user details + vote)      
- To prevent multiple voting, we save voted users in the temp table with the user id hashed to prevent admins from launching a time-based attack where they would watch data flooding into the database and compare it with the results. We also retrieve only active polls of a particular user, so users cannot access polls they have already voted on.  
- To prevent changing votes or deleting votes or users having access to polls after voting, the Vote table and voted user table are uneditable and undeletable.  
- During vote counts, we check the integrity of each vote for each poll using the Mac, hashed data, and vote together with the hmac key.  


## RoadBlocks
- Avoiding multiple votes without compromising on the anonymity of voters    
- Avoiding imposters from having access to the system.  
- Achieving the level of security at a good speed.  

# Instruction for Use.
The project has two different sub projects, back-end and a front-end.

## Backend
- Navigate into the backend-directory and run npm install to install all node packages.  
- Use the command npm run dev to start the application.
- Create an account using the endpoint "api/signup using postman or any alternative
- Use sqlite studio or any alternative to manually include an admin by inserting the the acc_id of the user. Note: This is to allow testing and not intended for production. 

## Front-End
- Navigate into tho the front-end directory and run npm install to install all packages.
- run npm start to start the application



