import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { before, describe, it } from "node:test";
import { should } from "chai";
import { VoteCount } from "../db/votes/vote";
let base_url = "http://localhost:8080/api";
chai.use(chaiHttp);
import { token } from "./poll.test";
//let token: string = "";
//test get vote results
// describe("Vote", () => {
//   before(async () => {
//     let user = {
//       username: "paul123",
//       pass: "paul123",
//     };
//     const response = await chai.request(base_url).post("/auth").send(user);
//     console.log(response)
//     token = `Bearer ${response.body.token}`;
//     console.log("Before: ", token);
//   });
// });


describe("/cast vote", () => {
  it("It should not allow user cast a vote wit null poll id", async() => {
    let vote = {
      title: "2023 Preseidency",
      poll_id: null,
      vote_casted: 2,
    };

    const response = await chai
      .request(base_url)
      .post("/vote/cast")
      .set("Authorization", token)
      .send(vote)
    expect(response).to.have.status(400);
    expect(response.body).to.be.an("array");

    expect(response.body[0]).to.have.property("msg");
    expect(response.body[0]).to.have.property("type");
    expect(response.body[0]).to.have.property("value");
  })
});


describe("/cast vote", () => {
  it("It should allow user cast a vote", async() => {
    let vote = {
      title: "Some title",
      poll_id: 1,
      vote_casted: 2,
    };
    const response = await chai
      .request(base_url)
      .post("/vote/cast")
      .set("Authorization", token)
      .send(vote);

    expect(response).to.have.status(201);
    expect(response.body).to.have.property("message");

    
  });
});


describe("/cast vote", () => {
  it("It should not allow for user to vote twice", async() => {
    let vote = {
      title: "2023 Preseidency",
      poll_id: 1,
      vote_casted: 2,
    };
    const response = await chai
      .request(base_url)
      .post("/vote/cast")
      .set("Authorization", token)
      .send(vote);

    expect(response).to.have.status(403);
    expect(response.body).to.have.property("message");

    
  });
});

describe("/Get Results", () => {
  
  it("It should get all results", async () => {
    const response = await chai
      .request(base_url)
      .get("/vote/result")
      .set("Authorization", token);

    expect(response).to.have.status(200);
    const vote_counts: VoteCount = response.body.voteCounts;
    expect(vote_counts).to.be.an("object");

    expect(Object.keys(vote_counts)).to.not.be.empty;
    Object.values(vote_counts).forEach((count) => {
      expect(count).to.have.property("title");
      expect(count).to.have.property("options").that.is.an("array");

      count.options.forEach((option) => {
        expect(option).to.have.property("option_id");
        expect(option).to.have.property("option_name");
        expect(option).to.have.property("option_image_url");
        expect(option).to.have.property("votes");
      });
    });
  });
});