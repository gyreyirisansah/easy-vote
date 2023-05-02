import React from 'react';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  options: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Option name is required'),
        imageUrl: Yup.string().url('Invalid image URL'),
      })
    )
    .min(1, 'At least one option is required'),
});

const AddPollForm = () => {
  const initialValues = {
    title: '',
    options: [{ name: '', imageUrl: '' }],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Submit logic
    console.log(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Field
              as={Form.Control}
              name="title"
              isInvalid={touched.title && errors.title}
            />
            <ErrorMessage name="title" component={Form.Control.Feedback} type="invalid" />
          </Form.Group>

          <FieldArray name="options">
            {({ push, remove }) => (
              <div>
                {values.options.map((option, index) => (
                  <div key={index}>
                    <Form.Group controlId={`options[${index}].name`}>
                      <Form.Label>Option Name</Form.Label>
                      <Field
                        as={Form.Control}
                        name={`options[${index}].name`}
                        isInvalid={
                          touched.options && touched.options[index] && touched.options[index].name && errors.options && errors.options[index] && errors.options[index].name
                        }
                      />
                      <ErrorMessage name={`options[${index}].name`} component={Form.Control.Feedback} type="invalid" />
                    </Form.Group>

                    <Form.Group controlId={`options[${index}].imageUrl`}>
                      <Form.Label>Option Image URL</Form.Label>
                      <Field
                        as={Form.Control}
                        name={`options[${index}].imageUrl`}
                        isInvalid={
                          touched.options && touched.options[index] && touched.options[index].imageUrl && errors.options && errors.options[index] && errors.options[index].imageUrl
                        }
                      />
                      <ErrorMessage name={`options[${index}].imageUrl`} component={Form.Control.Feedback} type="invalid" />
                    </Form.Group>

                    {values.options.length > 1 && (
                      <Button variant="danger" onClick={() => remove(index)}>
                        Remove Option
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="primary" onClick={() => push({ name: '', imageUrl: '' })}>
                  Add Option
                </Button>
              </div>
            )}
          </FieldArray>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Poll'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddPollForm;




















// import React, { useState } from "react";
// import { connect } from "react-redux";
// import { login } from "../redux/user/authAction";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import Button from "react-bootstrap/Button";

// const PollsForm = () => {
// const [showForm, setShowForm] = useState(false);

//   const loginSchema = Yup.object().shape({
//     username: Yup.string()
//       .required('Username is required'),
//     password: Yup.string()
//       .required('Password is required')
//       .min(4, 'Password must be at least 4 characters')
//   });

//   const formik = useFormik({
//     initialValues: {
//       pollTitle: ''
//     },
//     validationSchema: loginSchema,
//     onSubmit: (values) => {
//       const userData = {
//         username:values.username,
//         pass: values.password
//       }
//       // login(userData,navigate);
//     }
//   });
//   return (
//     <div className="container-sm ">
//       <div className="login_container">
//         <div className="text-center">
//           <h1>Login</h1>
//         </div>
//         <form onSubmit={formik.handleSubmit} className="">
//           <div>
//             <label htmlFor="pollTitle">Poll Title:</label>
//             <input
//               type="text"
//               id="pollTitle"
//               name="pollTitle"
//               className="login_input"
//               value={formik.values.pollTitle}
//               onChange={formik.handleChange}
//             />
//             {formik.touched.username && formik.errors.username ? (
//               <div className={"error"}>{formik.errors.username}</div>
//             ) : null}
//           </div>
          
//         </form>
//         <button onClick={handleShow}>Add</button>
//       </div>
//     </div>
//   );
// };

// export default PollsForm;