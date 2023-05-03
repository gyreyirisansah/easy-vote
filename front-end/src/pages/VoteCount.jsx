import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { getVoteCount } from "../redux/vote/voteAction";

const VoteCount = ({ vote_count, user, getVoteCount }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    console.log("I did run in votes");
    getVoteCount();
  }, [getVoteCount]);

  const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId,
    });
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log(selectedOptions);
  };

  const decodeUrl = (url) => {
    console.log(url);
    return decodeURIComponent(
      url.replace(/&#x([\dA-F]{2});/g, (match, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  };

  return (
    <>
      {vote_count.voteCounts &&
        Object.values(vote_count.voteCounts).map((poll, i) => (
          <div key={i} className="container vote-container">
            <Card className="vote_card">
            <Card.Body>
              <Card.Title className="vote-title">{poll.title}</Card.Title>
              <div>Total Vote Cast: {poll.invalidVotes.total_Vote_Cast}</div>
              <div>Total Invalid Votes: {poll.invalidVotes.total_number}</div>
              <div>
                {poll.options.map((option) => (
                  <div key={option.option_id} className="option-container">
                    <img src={decodeUrl(option.option_image_url)} />
                    <span className="d-inline">Votes: {option.votes} Percentage: {((option.votes)/(poll.invalidVotes.total_Vote_Cast))*100} %</span>

                    <span className="d-block">{option.option_name}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          </div>
          
        ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  vote_count: state.vote.vote_count,
});

export default connect(mapStateToProps, { getVoteCount })(VoteCount);
