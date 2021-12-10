import "../sass/pages/profile.sass";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { motion } from "framer-motion";
import { Redirect } from "react-router-dom";
import useStore from "../zustand/store";
import { ProfileImage } from "../components/ProfileImage";

const LOAD_USER_PROFILE_QUERY = gql`
  query loadUserProfile {
    me {
      username
      tag
      aboutMe
      email
      created
      image
    }
  }
`;

const CHANGE_ABOUT_ME_MUTATION = gql`
  mutation changeAboutMe($aboutMe: String!) {
    editAboutMe(aboutMe: $aboutMe)
  }
`;

const LOG_OUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

export const Profile: React.FC = () => {
  const loggedIn = useStore((state) => state.loggedIn);
  const setLoggedIn = useStore((state) => state.setLoggedIn);
  const { data, loading } = useQuery(LOAD_USER_PROFILE_QUERY);
  const [changeAboutMe] = useMutation(CHANGE_ABOUT_ME_MUTATION);
  const [logoutMutation] = useMutation(LOG_OUT_MUTATION);

  const [currentAboutMe, setCurrentAboutMe] = useState("");

  const userData = data?.me;

  useEffect(() => {
    setCurrentAboutMe(userData?.aboutMe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const created = new Date(userData?.created);

  // @ts-ignore
  const accountAge = Math.round(Math.abs((created - now) / oneDay));

  const accountAgeDetailed =
    accountAge >= 365
      ? {
          years: Math.round(accountAge / 365),
          days: (accountAge % 365) % 7,
        }
      : {
          years: null,
          days: accountAge,
        };

  const aboutMeRef = useRef<HTMLInputElement>(null);
  if (aboutMeRef.current && userData?.aboutMe) {
    aboutMeRef.current.value = userData?.aboutMe;
  }

  const logOut = () => {
    console.log("log out");
    logoutMutation();
    setLoggedIn(false);
    return <Redirect to="/login" />;
  };

  const pageTransition = {
    in: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
      },
    },
    out: {
      opacity: 0,
      x: "100%",
    },
  };

  if (loggedIn === false) {
    return <Redirect to="/login" />;
  }

  if (loggedIn === undefined) {
    return <Loading />;
  }

  return (
    <div className="profile">
      <Header route={"Profile"} />

      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className="userProfile"
          variants={pageTransition}
          initial="out"
          animate="in"
          exit="out"
        >
          <div className="profileDetails">
            <ProfileImage username={userData.username} image={userData.image} />
            <h3 className="userName">
              {userData?.username}
              <i className="tag"> #{userData?.tag}</i>
            </h3>
            <p className="email">{userData?.email}</p>
          </div>

          <div className="profileExtras">
            <Formik
              initialValues={{
                aboutMe: userData?.aboutMe || "",
              }}
              enableReinitialize={true}
              onSubmit={(values) => {
                changeAboutMe({
                  variables: {
                    aboutMe: values.aboutMe,
                  },
                });
                setCurrentAboutMe(values.aboutMe);
              }}
            >
              {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    as="textarea"
                    name="aboutMe"
                    type="text"
                    id="aboutMe"
                    className="changeAbout"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={values.aboutMe === currentAboutMe ? true : false}
                    className={`changeAboutButton ${
                      values.aboutMe !== currentAboutMe ? "valid" : ""
                    }`}
                  >
                    Save Changes
                  </button>
                </Form>
              )}
            </Formik>
            <button className="logOut" onClick={logOut}>
              Log Out
            </button>

            <div className="accountAge">
              <h3>Account age:</h3>
              {accountAgeDetailed.years && (
                <p>Years: {accountAgeDetailed.years}</p>
              )}
              <p>Days: {accountAgeDetailed.days}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
