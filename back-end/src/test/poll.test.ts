import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { before, beforeEach, describe, it } from "node:test";
import { should } from "chai";
import { PollResult } from "../db/polls/polls";

chai.use(chaiHttp);
let token: string = "";
let base_url = "http://localhost:8080/api";
//test get vote results
describe("Poll", () => {
  before(async () => {
    let user = {
      username: "paul123",
      pass: "paul123",
    };
    const response = await chai.request(base_url).post("/auth").send(user);
    token = `Bearer ${response.body.token}`;
    console.log("Before: ", token);
  });
});



describe("/add poll", () => {
  it("It should allow user not allow user to add a poll for a missing title", async () => {
    let poll = {
      title: "",
      options: [
        {
          option_name: "Siv Sivanee",
          option_image_url: "https://i.imgur.com/UYgarM6.jpg",
        },
        {
          option_name: "Iqbal Khatoon",
          option_image_url: "https://i.imgur.com/UYgarM6.jpg",
        },
      ],
    };
    const response = await chai
      .request(base_url)
      .post("/poll/add")
      .set("Authorization", token)
      .send(poll);
    expect(response).to.have.status(400);
    expect(response.body).to.be.an("array");

    expect(response.body[0]).to.have.property("msg");
    expect(response.body[0]).to.have.property("type");
    expect(response.body[0]).to.have.property("value");
  });
});

describe("/add poll", () => {
  it("It should allow admin to add polls", async () => {
    let poll = {
      title: "Some title",
      options: [
        {
          option_name: "Siv Sivanee",
          option_image_url: "https://i.imgur.com/UYgarM6.jpg",
        },
        {
          option_name: "Iqbal Khatoon",
          option_image_url: "https://i.imgur.com/UYgarM6.jpg",
        },
      ],
    };
    const response = await chai
      .request(base_url)
      .post("/poll/add")
      .set("Authorization", token)
      .send(poll);
    expect(response).to.have.status(201);
    expect(response.body).to.have.property("message");
  });
});

describe("/Get Active Polls", () => {
  it("It should get all active polls", async () => {
    const response = await chai
      .request(base_url)
      .get("/poll/active")
      .set("Authorization", token);
    expect(response).to.have.status(200);
    const polls: PollResult = response.body.polls;
    expect(polls).to.be.an("object");

    expect(Object.keys(polls)).to.not.be.empty;
    Object.values(polls).forEach((poll) => {
      expect(poll).to.have.property("title");
      expect(poll).to.have.property("options").that.is.an("array");

      poll.options.forEach((option) => {
        expect(option).to.have.property("option_id");
        expect(option).to.have.property("option_name");
        expect(option).to.have.property("option_image_url");
      });
    });
  });
});

export {token}