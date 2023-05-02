import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../redux/user/authAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const LoginForm = ({login}) => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const userData = {
        username:values.username,
        pass: values.password
      }
      login(userData,navigate);
    }
  });


  // const handleSubmit = e => {
  //   e.preventDefault();
  //   login(username, password);
  // };

  return (
    <div className='container-sm '>
      
      <div className= 'login_container'>
      <div className='text-center'>
      <h1 style={{fontWeight:"bold"}}>Login</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className=''>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="username"
          id="username"
          name="username"
          className="login_input"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className={"error"}>{formik.errors.username}</div>
        ) : null}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="login_input"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className={"error"}>{formik.errors.password}</div>
        ) : null}
      </div>
      {error ? <div>{error}</div> : null}
      <div className='text-center'>
      <div className='login_button'>
      <Button variant="secondary" type="submit">Login</Button>
      </div>
      </div>
    </form>
      </div>
      
    </div>
  );
};

export default connect(null, { login })(LoginForm);

