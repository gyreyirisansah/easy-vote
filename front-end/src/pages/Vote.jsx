import React, { useState,useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { getActivePolls } from '../redux/poll/pollAction';
import {castVote} from "../redux/vote/voteAction"

const Vote = ({activePolls, user, getActivePolls}) => {
  const [selectedOptions, setSelectedOptions] = useState({});
 
  useEffect(() => {
    console.log("I did run in votes")
    getActivePolls();

  }, [getActivePolls]);

  const handleOptionChange = (pollId, optionId,title) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId,
      title:title,
      vote:optionId,
      poll_id:pollId
    });
  };

  const dispatch = useDispatch()
  const handleSubmit = () => {
    // TODO: Implement submit logic
    const voteData = {
      title:selectedOptions.title,
      poll_id:selectedOptions.poll_id,
      vote_casted:selectedOptions.vote
    }
    // castVote(voteData)
    dispatch(castVote(voteData));
    console.log(selectedOptions);
  };

  const decodeUrl = (url) => {
    console.log(url)
    return decodeURIComponent(url.replace(/&#x([\dA-F]{2});/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }

  return (
    <>
      {activePolls.polls && Object.keys(activePolls.polls).map((poll_id, i) => (
        <Card key={i} >
          <Card.Body>
            <Card.Title>{activePolls.polls[poll_id].title}</Card.Title>
            <Form>
              {activePolls.polls[poll_id].options.map(option => (
                <div  key={option.option_id} >
                <img src={decodeUrl(option.option_image_url)} />
                <span className='d-inline'>
                                    <Form.Check
                 
                  inline
                //   label={option.option_name}
                  type="checkbox"
                  id={`option-${option.option_id}`}
                  value={option.option_id}
                  checked={selectedOptions[poll_id] === option.option_id}
                  onChange={() => handleOptionChange(poll_id, option.option_id,activePolls.polls[poll_id].title)}
                />
                </span>

                <span className='d-block'>{option.option_name}</span>
                </div>
              ))}
            </Form>
          </Card.Body>      
          <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
        </Card>
      ))}

    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getActivePolls: () => dispatch(getActivePolls()),
  castVote: (voteData) => dispatch(castVote(voteData))
});

const mapStateToProps = (state) => ({
    user: state.auth.user,
    activePolls: state.poll.activePolls
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Vote);
  
