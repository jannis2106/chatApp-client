import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Redirect } from "react-router";
import useStore from "../zustand/store";

const validateEmail = (value: string) => {
  let error;

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }

  return error;
};

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const LOGGED_IN_QUERY = gql`
  query loggedIn {
    loggedIn
  }
`;

export const Login = () => {
  const { data: loggedInData } = useQuery(LOGGED_IN_QUERY);
  const [loginMutation, { data }] = useMutation(LOGIN_MUTATION);
  const loggedIn = useStore((state) => state.loggedIn);
  const setLoggedIn = useStore((state) => state.setLoggedIn);

  if (loggedIn || loggedInData?.loggedIn || data?.login) {
    setLoggedIn(true);
    return <Redirect to="/" />;
  }

  return (
    <>
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, e) => {
          loginMutation({
            variables: {
              email: values.email,
              password: values.password,
            },
          });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              type="email"
              validate={validateEmail}
              id="email"
            />
            <ErrorMessage name="email" component="div" /> <br />
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" id="password" />
            <br />
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
