import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getActivePolls } from '../redux/poll/pollAction';
import { ListGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const ActivePolls = ({user,activePollTitles, getActivePolls }) => {
    useEffect(() => {
        console.log("I did run")
        getActivePolls();
      }, [getActivePolls]);
    
    const navigate = useNavigate()
    const handleStartVoting = () => {
        navigate("/vote");
    };

    console.log("Has length? "+ (activePollTitles && activePollTitles.length > 0))
  return (
    <div>
      <h1 style={{fontWeight:"bold",color:"#584e4e"}}>Active Polls  {user? "for " + user.user:""}</h1>
      {activePollTitles && activePollTitles.length > 0 ? (
        <div>,
          <ListGroup>
          {activePollTitles.map((poll,i) => (
            <div className='list' key={i}>
              <ListGroup.Item >{poll}</ListGroup.Item>
            </div>
          ))}
        </ListGroup>
        <Button variant="secondary" onClick={handleStartVoting}>Start Voting</Button>
        </div>
        
      ) : (
        <p>No active polls {user? "for "+user.user:""}.</p>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  activePollTitles: state.poll.activePollTitles,
});

export default connect(mapStateToProps, { getActivePolls })(ActivePolls);
