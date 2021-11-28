import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import { Redirect } from "react-router";
import { Loading } from "../components/Loading";
import useStore from "../zustand/store";

const validateUsername = (value: string) => {
  let error;

  if (value.length > 20) {
    error = "Username is too long";
  }

  return error;
};

const validateEmail = (value: string) => {
  let error;

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }

  return error;
};

const validatePassword = (value: string) => {
  let error;

  if (value.length < 8) {
    error = "Your password is too short";
  } else if (value.search(/\d/) === -1) {
    error = "Your password must contain at least one number";
  } else if (value.search(/[a-zA-Z]/) === -1) {
    error = "Your password must contain at least one letter";
  }

  return error;
};

const REGISTER_MUTATION = gql`
  mutation ($data: RegisterInput!) {
    register(data: $data) {
      usernameTag
    }
  }
`;

export const Register = () => {
  const [registerMutation, { data }] = useMutation(REGISTER_MUTATION);
  const loggedIn = useStore((state) => state.loggedIn);

  console.log(loggedIn);

  if (data?.register || loggedIn === true) {
    return <Redirect to="/" />;
  }

  if (loggedIn === undefined) {
    return <Loading />;
  }

  if (loggedIn === false)
    return (
      <div className="register">
        <h1>Register</h1>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={(values, { resetForm }) => {
            registerMutation({
              variables: {
                data: values,
              },
            });
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <label htmlFor="username">Username</label>
              <Field
                name="username"
                type="text"
                validate={validateUsername}
                id="username"
              />{" "}
              {errors.username && touched.username && (
                <div>{errors.username}</div>
              )}{" "}
              <br />
              {/*  */}
              <label htmlFor="email">Email</label>
              <Field
                name="email"
                type="email"
                validate={validateEmail}
                id="email"
              />{" "}
              {errors.email && touched.email && <div>{errors.email}</div>}{" "}
              <br />
              {data?.register === null ? (
                <div>Account with this email already exists</div>
              ) : (
                <div></div>
              )}
              {/*  */}
              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
                validate={validatePassword}
                id="password"
              />{" "}
              <br />
              {errors.password && touched.password && (
                <div>{errors.password}</div>
              )}{" "}
              <br />
              {/*  */}
              <button type="submit">Login</button>
            </Form>
          )}
        </Formik>
      </div>
    );
  else return <Redirect to="/" />;
};
