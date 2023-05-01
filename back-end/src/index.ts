import express,{Express}  from "express";
import bodyParser from "body-parser";
import {login,loginValidator} from "./controllers/auth/auth"
import { addUserInfo_Cont, addUserValidator, signup} from "./controllers/user/createAccount";
import {getActivePolls,createPolls, addPollValidator} from "./controllers/poll/poll"
import "dotenv/config"
import log4js from "log4js"
import { castVote, castVoteValidator, getAllVoteCount } from "./controllers/votes/vote";

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

app.use(bodyParser.json());

app.post("/auth",loginValidator, login)

app.post("/signup",loginValidator,signup)
app.post("/user/add",addUserValidator, addUserInfo_Cont)

app.post("/poll/add",addPollValidator,createPolls)
app.get("/poll/active",getActivePolls)

app.post("/vote/cast",castVoteValidator,castVote)
app.get("/vote/result", getAllVoteCount)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });