import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useStore from "../../zustand/store";
import { ProfileImage } from "../ProfileImage";

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
      <div className="participants">
        <h3>PARTICIPANTS</h3>
        {participants?.map((participant) => (
          <div key={"participant" + participant.id}>
            <ProfileImage
              image={participant.image}
              userName={participant.username}
            />
            <p>{participant.username}</p>
            <p>{participant.aboutMe}</p>
          </div>
        ))}
        <h3>ADMINS</h3>
        {admins?.map((admin) => (
          <div key={"admin" + admin.id}>
            <ProfileImage image={admin.image} userName={admin.username} />

            <p>{admin.username}</p>
            <p>{admin.aboutMe}</p>
          </div>
        ))}
      </div>
      <div className="roomActions">
        <form onSubmit={forceUpdate}>
          <button type="submit" onClick={leaveRoom}>
            Leave Room
          </button>
        </form>
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
                  <label htmlFor="userNameOrEmail">
                    Enter <code>user@email.com</code> OR{" "}
                    <code>UserName#1234</code> <br />
                  </label>
                  <Field
                    name="userNameOrEmail"
                    validate={validateAddUserInput}
                    type="text"
                    id="userNameOrEmail"
                  />
                  <ErrorMessage name="userNameOrEmail" component="div" /> <br />
                  {userGotAdded?.addUserToRoom === false && (
                    <div>User not found or already joined the room</div>
                  )}
                  <button type="submit">Add User</button>
                </>
              ) : (
                <span></span>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// add Formik validation to the form add User
