import React, { useEffect } from 'react';
import ActivePoll from '../components/ActivePoll';
import { getActivePolls } from '../redux/poll/pollAction';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Home() {

  // useEffect(() => {
  //   getActivePolls();
  // });
  //


  return (
    <div>
      <h1 align="center" style={{ fontSize: "3.5rem",fontWeight:"bold",color:"indianred"}}  >Welcome to Easy Vote</h1>
     
      <ActivePoll />
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   activePolls: state.poll.activePolls,
//   user: state.auth.user

// });
export default Home
// export default connect(mapStateToProps, { getActivePolls })(Home);
