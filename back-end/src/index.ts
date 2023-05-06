import express,{Express}  from "express";
import bodyParser from "body-parser";
import {isAdminUser, login,loginValidator} from "./controllers/auth/auth"
import { addUserInfo_Cont, addUserValidator, signup} from "./controllers/user/createAccount";
import {getActivePolls,createPolls, addPollValidator} from "./controllers/poll/poll"
import "dotenv/config"
import log4js from "log4js"
import { castVote, castVoteValidator, getAllVoteCount } from "./controllers/votes/vote";
import cors from "cors"

log4js.configure({
    appenders: {
      app:{type:"file",
        filename:"log.txt"
      },
      errorFile:{
        type:"file",
        filename:"log_errors.txt"
      },
      errors:{
        type: "logLevelFilter",
        level:"ERROR",
        appender:"errorFile"
      }
    },
    categories:{
      default:{appenders:["app"],level:"debug"},
      errors:{appenders:["errors"],level:"debug"}
      }
  });

const app: Express = express();
const port = 8080;
app.use(cors())

app.use(bodyParser.json());

app.post("/api/auth",loginValidator, login)

app.post("/api/signup",loginValidator,signup)
app.post("/api/user/add",addUserValidator, addUserInfo_Cont)

app.post("/api/poll/add",addPollValidator,createPolls)
app.get("/api/poll/active",getActivePolls)

app.post("/api/vote/cast",castVoteValidator,castVote)
app.get("/api/vote/result", getAllVoteCount)

app.get("/api/isAdmin", isAdminUser)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });


  export default app;