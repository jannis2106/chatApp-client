import "../sass/pages/login.sass";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import { Redirect } from "react-router";
import useStore from "../zustand/store";
import { ReactComponent as Logo } from "../sass/images/logo.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const Login = () => {
  const [loginMutation, { data: loginMutationData }] =
    useMutation(LOGIN_MUTATION);
  const loggedIn = useStore((state) => state.loggedIn);
  const setLoggedIn = useStore((state) => state.setLoggedIn);
  console.log("0");

  if (loggedIn) {
    console.log("2");
    console.log(loggedIn);
    return <Redirect to="/" />;
  }

  if (loginMutationData?.login) {
    console.log("1");
    setLoggedIn(true);
    return <Redirect to="/" />;
  }

  const dropIn = {
    hidden: {
      transform: "translateY(-100vh)",
      opacity: 0,
    },
    visible: {
      transform: "translateY(0vh)",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "800px",
      opacity: 0,
    },
  };

  return (
    <div className="login">
      <motion.div
        className="loginContainer"
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragPropagation={true}
        dragElastic={0.5}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1>Login</h1>
        <div className="content">
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
            {({ handleSubmit, isSubmitting, values }) => (
              <Form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label> <br />
                <div className="inputWrapper">
                  <Field name="email" type="email" id="email" />
                </div>
                <label htmlFor="password">Password</label> <br />
                <div className="inputWrapper">
                  <Field name="password" type="password" id="password" />
                </div>
                <br />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                      values.email
                    ) && values.password !== ""
                      ? "valid"
                      : ""
                  }
                >
                  Login
                </button>
                <p className="createAccount">
                  Don't have an account?{" "}
                  <Link className="link" to="/register">
                    Create one now
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
          <div className="rightSide">
            <Logo />
            <h1>Chat Application</h1>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
