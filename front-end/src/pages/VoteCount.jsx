import React, { useState,useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getActivePolls } from '../redux/poll/pollAction';

const VoteCount = ({activePolls, user, getActivePolls}) => {
  const [selectedOptions, setSelectedOptions] = useState({});
 
  useEffect(() => {
    console.log("I did run in votes")
    getActivePolls();

  }, [getActivePolls]);

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
      {activePolls.polls && Object.values(activePolls.polls).map((poll, i) => (
        <Card key={i} >
          <Card.Body>
            <Card.Title>{poll.title}</Card.Title>
            <div>
              {poll.options.map(option => (
                <div  key={option.option_id} >
                <img src="http://placekitten.com/100/100" />
                <span className='d-inline'>votes here
                </span>

                <span className='d-block'>{option.option_name}</span>
                </div>
              ))}
            </div>
          </Card.Body>      
          <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
        </Card>
      ))}

    </>
  );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    activePolls: state.poll.activePolls
  });
  
export default connect(mapStateToProps, { getActivePolls })(VoteCount);
  
