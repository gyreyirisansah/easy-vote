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

  return (
    <>
      {vote_count.voteCounts &&
        Object.values(vote_count.voteCounts).map((poll, i) => (
          <Card key={i}>
            <Card.Body>
              <Card.Title>{poll.title}</Card.Title>
              <div>Total Vote Cast: {poll.invalidVotes.total_Vote_Cast}</div>
              <div>Total Invalid Votes: {poll.invalidVotes.total_number}</div>
              <div>
                {poll.options.map((option) => (
                  <div key={option.option_id}>
                    <img src="http://placekitten.com/100/100" />
                    <span className="d-inline">Votes: {option.votes} Percentage: {((option.votes)/(poll.invalidVotes.total_Vote_Cast))*100} %</span>

                    <span className="d-block">{option.option_name}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  vote_count: state.vote.vote_count,
});

export default connect(mapStateToProps, { getVoteCount })(VoteCount);
