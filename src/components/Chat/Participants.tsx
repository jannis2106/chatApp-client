import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useStore from "../../zustand/store";
import { ProfileImage } from "../ProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const LEAVE_ROOM_MUTATION = gql`
  mutation leaveRoom($roomId: Float!) {
    leaveRoom(roomId: $roomId)
  }
`;

const IS_ADMIN_QUERY = gql`
  query isAdmin($roomId: Float!) {
    isAdmin(roomId: $roomId)
  }
`;

const ADD_USER_MUTATION = gql`
  mutation addUserToRoom($emailOrUsernameTag: String!, $roomId: Float!) {
    addUserToRoom(emailOrUsernameTag: $emailOrUsernameTag, roomId: $roomId)
  }
`;

const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

const validateAddUserInput = (value: string) => {
  let error;

  if (
    // email regex
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
    // username#tag regex
    /^.{3,32}#[0-9]{4}$/.test(value)
  ) {
    return error;
  } else {
    error = "Invalid email or username format";
  }

  console.log(/^.{3,32}#[0-9]{4}$/.test(value));
  console.log(error);
  console.log(value);
};

export const Participants = () => {
  const participants = useStore((state) => state.participants);
  const admins = useStore((state) => state.admins);
  const currentChat = useStore((state) => state.currentChat);

  const [leaveRoomMutation] = useMutation(LEAVE_ROOM_MUTATION, {
    variables: {
      // @ts-ignore idk why but currentChat isn't a number
      roomId: parseInt(currentChat, 10),
    },
  });
  const [addUserMutation, { data: userGotAdded }] =
    useMutation(ADD_USER_MUTATION);

  const { data: isAdmin } = useQuery(IS_ADMIN_QUERY, {
    variables: {
      // @ts-ignore idk why but currentChat isn't a number
      roomId: parseInt(currentChat, 10),
    },
  });

  console.log(userGotAdded);

  const leaveRoom = () => {
    leaveRoomMutation();
  };

  const forceUpdate = useForceUpdate();

  return (
    <div className="chatSideDetail">
      <div className="user">
        <div className="participants">
          <h3>PARTICIPANTS</h3>
          {participants?.map((participant) => (
            <UserCard
              id={participant.id}
              image={participant.image}
              username={participant.username}
              aboutMe={participant.aboutMe}
            />
          ))}
        </div>
        <div className="admins">
          <h3>ADMINS</h3>
          {admins?.map((admin) => (
            <UserCard
              id={admin.id}
              image={admin.image}
              username={admin.username}
              aboutMe={admin.aboutMe}
            />
          ))}
        </div>
      </div>
      <div className="roomActions">
        <Formik
          initialValues={{
            userNameOrEmail: "",
          }}
          onSubmit={(values, e) => {
            console.log(values);
            addUserMutation({
              variables: {
                emailOrUsernameTag: values.userNameOrEmail,
                // @ts-ignore idk why but currentChat isn't a number
                roomId: parseInt(currentChat, 10),
              },
            });
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              {isAdmin?.isAdmin ? (
                <>
                  <label htmlFor="userNameOrEmail" className="addUserLabel">
                    Enter <code>user@email.com</code> OR{" "}
                    <code>UserName#1234</code> <br />
                  </label>
                  <Field
                    name="userNameOrEmail"
                    validate={validateAddUserInput}
                    type="text"
                    id="userNameOrEmail"
                    className="addUserInput"
                  />
                  <ErrorMessage name="userNameOrEmail" component="div" /> <br />
                  {userGotAdded?.addUserToRoom === false && (
                    <div>User not found or already joined the room</div>
                  )}
                  <button type="submit" className="addUserButton">
                    Add User
                  </button>
                </>
              ) : (
                <span></span>
              )}
            </Form>
          )}
        </Formik>
        <form onSubmit={forceUpdate}>
          <button type="submit" onClick={leaveRoom} className="leaveRoom">
            Leave Room
          </button>
        </form>
      </div>
    </div>
  );
};

// add Formik validation to the form add User

interface UserCardProps {
  id: number;
  image: string;
  username: string;
  aboutMe: string;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  image,
  username,
  aboutMe,
}) => {
  return (
    <div key={"admin" + id} className="userCard">
      <ProfileImage image={image} username={username} />

      <div className="nameAboutme">
        <p className="userName">{username}</p>
        <p className="aboutMe">{aboutMe}</p>
      </div>
      <div className="sendMessage">
        <FontAwesomeIcon icon={faComment} />
      </div>
    </div>
  );
};
