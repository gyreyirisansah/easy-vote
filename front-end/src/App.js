import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './pages/Login';
import Welcome from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Vote from './pages/Vote';
import PollsForm from './pages/PollsForm'
import VoteCount from './pages/VoteCount';

const App = () => {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<LoginForm/>} />
          {/* <Route path={'/'|'/home'} 
          element={
            <PrivateRoute>
              <Welcome/>
            </PrivateRoute>
          }
          /> */}
          {["/", "/home"].map((path, index) => {
        return (
          <Route path={path} element={
            <PrivateRoute>
            <Welcome/>
            </PrivateRoute>
            }
            key={index}
          />
        );
      })}

        <Route path={'/vote'} 
          element={
            <PrivateRoute>
              <Vote/>
            </PrivateRoute>
          }
          /> 
        <Route path={'/poll/add'} 
          element={
              <PollsForm/>
          }
          /> 
        <Route path={'/votes/count'} 
          element={
              <VoteCount/>
          }
          /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
