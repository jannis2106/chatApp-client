import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";
import useStore from "../zustand/store";
import { ReactComponent as Logo } from "../sass/images/logo.svg";
import "../sass/pages/register.sass";
import React, { useState } from "react";
import { motion } from "framer-motion";

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
  const setLoggedIn = useStore((state) => state.setLoggedIn);

  const [usernameInput, setUsernameInput] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 20) {
      return;
    }
    setUsernameInput(e.currentTarget.value);

    if (e.currentTarget.value !== "") {
      setIsUsernameValid(true);
    } else {
      setIsUsernameValid(false);
    }
  };

  const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEmailInput(e.currentTarget.value);

    if (
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.currentTarget.value)
    ) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPasswordInput(e.currentTarget.value);

    if (e.currentTarget.value.length >= 8) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  if (data?.register || loggedIn === true) {
    setLoggedIn(true);
    return <Redirect to="/" />;
  }

  if (loggedIn === undefined) {
    return <Loading />;
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
    <div className="register">
      <motion.div
        className="registerContainer"
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragPropagation={true}
        dragElastic={0.5}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1>Register</h1>
        <div className="content">
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
            }}
            onSubmit={async () => {
              console.log("button click");
              registerMutation({
                variables: {
                  data: {
                    username: usernameInput,
                    email: emailInput,
                    password: passwordInput,
                  },
                },
              });
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <div className="inputWrapper">
                  <Field
                    value={usernameInput}
                    onChange={onUsernameChange}
                    name="username"
                    type="text"
                    // validate={validateUsername}
                    id="username"
                  />
                </div>
                <label htmlFor="email">Email</label>
                <div className="inputWrapper">
                  <Field
                    value={emailInput}
                    onChange={onEmailChange}
                    name="email"
                    type="email"
                    // validate={validateEmail}
                    id="email"
                  />
                </div>
                {/* {data?.register === null ? (
                    <div>Account with this email already exists</div>
                  ) : (
                    <div></div>
                  )} */}
                {/*  */}
                <label htmlFor="password">Password</label>
                <div className="inputWrapper">
                  <Field
                    value={passwordInput}
                    onChange={onPasswordChange}
                    name="password"
                    type="password"
                    // validate={validatePassword}
                    id="password"
                  />
                </div>

                {/* {errors.password && touched.password && (
                    <div>{errors.password}</div>
                  )}{" "} */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    isUsernameValid && isEmailValid && isPasswordValid
                      ? "valid"
                      : ""
                  }
                >
                  Login
                </button>
                <p className="createAccount">
                  Already have an account?{" "}
                  <Link className="link" to="/login">
                    Log in here
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
