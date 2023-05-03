import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginForm from "./pages/Login";
import Welcome from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Vote from "./pages/Vote";
import PollsForm from "./pages/PollsForm";
import VoteCount from "./pages/VoteCount";
import MyNavbar from "./components/Navbar";

const App = () => {
  
  return (
    <div>
      <BrowserRouter>
      <MyNavbar/>
        <Routes>
          
          <Route exact path="/login" element={<LoginForm />} />
          {/* <Route path={'/'|'/home'} 
          element={
            <PrivateRoute>
              <Welcome/>
            </PrivateRoute>
          }
          /> */}
          {["/", "/home"].map((path, index) => {
            return (
              <Route
                path={path}
                element={
                  <PrivateRoute>
                    <Welcome />
                  </PrivateRoute>
                }
                key={index}
              />
            );
          })}

          <Route
            path={"/vote"}
            element={
              <PrivateRoute>
                <Vote />
              </PrivateRoute>
            }
          />
          <Route
            path={"/vote/count"}
            element={
              <PrivateRoute>
                <VoteCount />
              </PrivateRoute>
            }
          />
          <Route path={"/poll/add"} element={
            <PrivateRoute><PollsForm /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
