import { gql, useMutation } from "@apollo/client";
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

// const LOGGED_IN_QUERY = gql`
//   query loggedIn {
//     loggedIn
//   }
// `;

export const Login = () => {
  // const { data: loggedInData } = useQuery(LOGGED_IN_QUERY);
  const [loginMutation, { data: loginMutationData }] =
    useMutation(LOGIN_MUTATION);
  const loggedIn = useStore((state) => state.loggedIn);
  const setLoggedIn = useStore((state) => state.setLoggedIn);
  console.log("0");

  // const [canRedirect, setCanRedirect] = useState(false);

  if (loggedIn) {
    console.log("2");
    console.log(loggedIn);
    // setCanRedirect(true);
    return <Redirect to="/" />;
  }

  if (loginMutationData?.login) {
    console.log("1");
    setLoggedIn(true);
    return <Redirect to="/" />;
  }

  // if (canRedirect) {
  //   console.log("3");
  //   return <Redirect to="/" />;
  // }

  // if (loggedIn === false)
  return (
    <div className="login">
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
    </div>
  );
  // else return <Redirect to="/" />;
};
