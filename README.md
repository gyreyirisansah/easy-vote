# easy-vote
This simple application allows members of an organization, club, or student association to vote on various topics or polls.

## Relevance
-Ensures anonymous voting   
-Ensures integrity of votes  
-Real-time counting of votes  

## Scope and Assumptions
-User accounts are managed by the mother institution and assumed to be secured.

## Project Architecture
### Data Flow from Front-end to Back-end
-User input validated with YUP  
-Authentication token passed as headers  
-Data passed to express-validator middleware to validate input.  
-Request passed with validated data to authentication middleware.  
-Request proceeds to a success callback function.  

### Data Flow from back-end to Front-end
-Fetch data from DB  
-Maps data to defined types  
-Return data as a JSON object  

## Anonymous Voting
-Hash user details (Random salt + vote + acc id)  
-Generate HMAC (key: poll id + HMAC key, data: hashed user details + vote)  
-HMAC, hashed user details, and vote saved in DB  

## Vote Integrity
-Saving voted users in the temp table. User id encrypted.  
-Retrieves only active polls  
-Vote table and voted user table uneditable and undeletable.  
-Using hmac to check votes credibility  


## RoadBlocks
-Avoiding multiple votes without compromising on the anonymity of voters  
-Avoiding imposters from having access to the system.  
-Achieving the level of security at a good speed.  