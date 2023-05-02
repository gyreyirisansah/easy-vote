import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../redux/user/authAction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({login}) => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .required('username is required'),
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
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="username"
          id="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </div>
      {error ? <div>{error}</div> : null}
      <button type="submit">Login</button>
    </form>
  );
};

export default connect(null, { login })(LoginForm);

