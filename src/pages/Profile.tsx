import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";

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

export const Profile: React.FC = () => {
  const { data } = useQuery(LOAD_USER_PROFILE_QUERY);
  const [changeAboutMe] = useMutation(CHANGE_ABOUT_ME_MUTATION);

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

  return (
    <div className="profile">
      <Link to="/">
        <button>
          <h1> &lt; </h1> {/* &lt; = "<" */}
        </button>
      </Link>
      <h1>Profile</h1>
      <div>
        <img src={userData?.image ? `http://${userData.image}` : ""} alt="" />
        <h3>
          {userData?.username}
          <i> #{userData?.tag}</i>
        </h3>
      </div>

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
          console.log(values);
        }}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <Field name="aboutMe" type="text" id="aboutMe" />
            <button
              type="submit"
              disabled={values.aboutMe === currentAboutMe ? true : false}
            >
              Save Changes
            </button>
          </Form>
        )}
      </Formik>

      {/* <input type="text" ref={aboutMeRef} onSubmit={changeAboutMe({variables: {aboutMe: aboutMeRef.current ? aboutMeRef.current.value : ""}})}/> */}

      <p>{userData?.email}</p>
      <div>
        <h3>Account age:</h3>
        {accountAgeDetailed.years && <p>Years: {accountAgeDetailed.years}</p>}
        <p>Days: {accountAgeDetailed.days}</p>
      </div>
    </div>
  );
};
