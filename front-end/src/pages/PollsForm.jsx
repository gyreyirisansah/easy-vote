import React, { useEffect } from "react";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import { checkIsAdmin, addPoll } from "../redux/poll/pollAction";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Alert} from "react-bootstrap"

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        option_name: Yup.string().required("Option name is required"),
        option_image_url: Yup.string().url("Invalid image URL"),
      })
    )
    .min(1, "At least one option is required"),
});

const AddPollForm = ({ isAdmin, add_polls_response, dataFetchError, checkIsAdmin, addPoll }) => {
  const initialValues = {
    title: "",
    options: [{ option_name: "", option_image_url: "" }],
  };

  useEffect(() => {
    checkIsAdmin();
  }, [checkIsAdmin]);

  const handleSubmit = (values, { setSubmitting, resetForm  }) => {
    // Submit logic
    console.log(values);
    addPoll(values);
    setSubmitting(false);
    resetForm();
  };
  const navigate = useNavigate();

  if (isAdmin) {
    return (
      <div className="container add-poll-container">
        {add_polls_response.add_polls_response && (
          <Alert variant={dataFetchError.error ? "danger" : "success"}>
            {add_polls_response.add_polls_response.message}
          </Alert>
        )}

        <div className="add-poll-title">Add Polls</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleSubmit, isSubmitting, resetForm  }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Field
                  as={Form.Control}
                  name="title"
                  isInvalid={touched.title && errors.title}
                />
                <ErrorMessage
                  name="title"
                  component={Form.Control.Feedback}
                  type="invalid"
                />
              </Form.Group>

              <FieldArray name="options">
                {({ push, remove }) => (
                  <div>
                    {values.options.map((option, index) => (
                      <div key={index}>
                        <Form.Group controlId={`options[${index}].option_name`}>
                          <Form.Label>Option Name</Form.Label>
                          <Field
                            as={Form.Control}
                            name={`options[${index}].option_name`}
                            isInvalid={
                              touched.options &&
                              touched.options[index] &&
                              touched.options[index].option_name &&
                              errors.options &&
                              errors.options[index] &&
                              errors.options[index].option_name
                            }
                          />
                          <ErrorMessage
                            name={`options[${index}].option_name`}
                            component={Form.Control.Feedback}
                            type="invalid"
                          />
                        </Form.Group>

                        <Form.Group
                          controlId={`options[${index}].option_image_url`}
                        >
                          <Form.Label>Option Image URL</Form.Label>
                          <Field
                            as={Form.Control}
                            name={`options[${index}].option_image_url`}
                            isInvalid={
                              touched.options &&
                              touched.options[index] &&
                              touched.options[index].option_image_url &&
                              errors.options &&
                              errors.options[index] &&
                              errors.options[index].option_image_url
                            }
                          />
                          <ErrorMessage
                            name={`options[${index}].option_image_url`}
                            component={Form.Control.Feedback}
                            type="invalid"
                          />
                        </Form.Group>

                        {values.options.length > 1 && (
                          <Button
                            variant="danger"
                            onClick={() => remove(index)}
                          >
                            Remove Option
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="btn btn-secondary"
                      onClick={() =>
                        push({ option_name: "", option_image_url: "" })
                      }
                      className="add-option-button"
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </FieldArray>

              <Button
                variant="btn btn-secondary"
                type="submit"
                disabled={isSubmitting}
                className="add-poll-button"
              >
                {isSubmitting ? "Submitting..." : "Add Poll"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  } else {
    return (
      <div className="container not-admin-container">
        <p>You are not authorized to view this page.</p>
        <p>Please log in as an admin user.</p>
        <Button variant="btn btn-secondary" onClick={() => navigate("/login")}>
          Go to Login Page
        </Button>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  isAdmin: state.poll.isAdmin,
  add_polls_response: state.poll.add_polls_response,
  dataFetchError: state.poll.dataFetchError
});

export default connect(mapStateToProps, { checkIsAdmin, addPoll })(AddPollForm);
