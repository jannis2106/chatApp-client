import "../sass/pages/profile.sass";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

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
  const { data, loading } = useQuery(LOAD_USER_PROFILE_QUERY);
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

  if (loading) return <Loading />;

  return (
    <div className="profile">
      <Header route={"Profile"} />

      <div className="userProfile">
        <div className="profileDetails">
          <img
            src={userData?.image ? `http://${userData.image}` : ""}
            alt=""
            className="profileImage"
          />
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
                  autocomplete="off"
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

          <div className="accountAge">
            <h3>Account age:</h3>
            {accountAgeDetailed.years && (
              <p>Years: {accountAgeDetailed.years}</p>
            )}
            <p>Days: {accountAgeDetailed.days}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
