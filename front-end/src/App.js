import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './pages/Login';
import Welcome from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <div style={{ backgroundColor: 'gray' }}>
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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
