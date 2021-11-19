import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import useStore from "../../zustand/store";
import { ProfileImage } from "../ProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { LOAD_ROOM_QUERY } from "../../apollo/graphql/Mutations";
// import client from "../../apollo/client";

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
  mutation addUserToRoom($usernameTag: String!, $roomId: Float!) {
    addUserToRoom(usernameTag: $usernameTag, roomId: $roomId) {
      message
      statusCode
      user {
        id
        username
        image
        aboutMe
      }
    }
  }
`;

const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export const Participants = () => {
  const participants = useStore((state) => state.participants);
  const admins = useStore((state) => state.admins);
  const currentChat = useStore((state) => state.currentChat);

  const [leaveRoomMutation] = useMutation(LEAVE_ROOM_MUTATION, {
    variables: {
      // @ts-ignore not sure why but currentChat isn't a number
      roomId: parseInt(currentChat, 10),
    },
  });
  const [addUserMutation, { data: addUserMutationData }] =
    useMutation(ADD_USER_MUTATION);

  const [hasFocus, setFocus] = useState(false);

  const { data: isAdmin } = useQuery(IS_ADMIN_QUERY, {
    variables: {
      // @ts-ignore not sure why but currentChat isn't a number
      roomId: parseInt(currentChat, 10),
    },
  });

  const [addUserInputValue, setAddUserInputValue] = useState("");
  const [isAddUserInputValueValid, setIsAddUserInputValueValid] =
    useState(false);

  const leaveRoom = () => {
    leaveRoomMutation();
  };

  // handles which inputs are / aren't accepted for addUserInputValue
  const handleAddUserInputChange = (e: any) => {
    const value = e.target.value;

    const noSpacesRegex = /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)$/gm;

    if (!noSpacesRegex.test(value)) {
      return;
    }

    // username max-length is 20 -> 20 + # + 4 numbers
    if (value.length > 25) {
      return;
    }

    const duplicateHashtagRegex =
      /#(?:([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#/gm;
    const tooManyNumbersRegex =
      /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#([0-9][0-9][0-9][0-9][0-9])$/gm;

    if (duplicateHashtagRegex.test(value) || tooManyNumbersRegex.test(value)) {
      return;
    }

    const containsHashtagRegex = /#/;
    const isNumberOrHastagRegex = /[0-9]|#/;

    // can't enter letter after #
    if (
      containsHashtagRegex.test(value) &&
      !isNumberOrHastagRegex.test(value[value.length - 1])
    ) {
      return;
    }

    setAddUserInputValue(value);
    // reset error messages on change
    if (addUserMutationData?.addUserToRoom?.message) {
      addUserMutationData.addUserToRoom.message = undefined;
    }
  };

  // ! die 4 regexes nehmen kein leerzeichen, sprich test  #1 wird nicht verstanden und es wird test   #1#0000 zurrückgegeben
  // add user hint value
  const getAddUserInput = (input: string) => {
    const validRegex =
      /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#([0-9][0-9][0-9][0-9])$/gm;
    const oneMissingNumberRegex =
      /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#([0-9][0-9][0-9])$/gm;
    const twoMissingNumbersRegex =
      /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#([0-9][0-9])$/gm;
    const threeMissingNumbersRegex =
      /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#([0-9])$/gm;
    const hastagRegex = /^(([A-Za-z0-9$&+,:;=?@#|'<>.^*()%!-])*)#$/gm;

    if (hastagRegex.test(input)) {
      setIsAddUserInputValueValid(false);
      return `${input}0000`;
    }
    if (threeMissingNumbersRegex.test(input)) {
      setIsAddUserInputValueValid(false);
      return `${input}000`;
    }
    if (twoMissingNumbersRegex.test(input)) {
      setIsAddUserInputValueValid(false);
      return `${input}00`;
    }
    if (oneMissingNumberRegex.test(input)) {
      setIsAddUserInputValueValid(false);
      return `${input}0`;
    }
    if (validRegex.test(input)) {
      setIsAddUserInputValueValid(true);
      return input;
    }

    setIsAddUserInputValueValid(false);
    return `${input}#0000`;
  };

  useEffect(() => {
    // setAddUserStatus(addUserMutationData);
    console.log(addUserMutationData);
  }, [addUserMutationData]);

  const forceUpdate = useForceUpdate();

  // const addUser = (usernameTag: string, roomId: number) => {
  //   return (e: React.MouseEvent) => {
  //     console.log(usernameTag);
  //     addUserMutation({
  //       variables: {
  //         usernameTag,
  //         roomId,
  //       },
  //     });
  //     // participantsArray -> add returned user to it -> save to room participants query
  //     let newParticipant = {
  //       id: addUserMutationData.addUserToRoom.user.id,
  //       username: addUserMutationData.addUserToRoom.user.username,
  //       image: addUserMutationData.addUserToRoom.user.image,
  //       aboutMe: addUserMutationData.addUserToRoom.user.aboutme,
  //     };
  //     let newParticipants = participants.push(newParticipant);

  //     client.writeQuery({
  //       query: gql`
  //         query loadRoom($roomId: Float!) {
  //           loadRoom(roomId: $roomId) {
  //             participants {
  //               id
  //               username
  //               image
  //               aboutMe
  //             }
  //           }
  //         }
  //       `,
  //       data: {
  //         loadRoom: {
  //           participants: newParticipants,
  //         },
  //       },
  //       // @ts-ignore
  //       variables: { userId: usernameTag, roomId: parseInt(currentChat, 10) },
  //     });
  //     e.preventDefault();
  //   };
  // };

  return (
    <div className="chatSideDetail">
      <div className="user">
        <div className="participants">
          <h3>PARTICIPANTS</h3>
          {participants?.map((participant) => (
            <UserCard
              id={participant.id}
              key={participant.id}
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
              key={admin.id}
              image={admin.image}
              username={admin.username}
              aboutMe={admin.aboutMe}
            />
          ))}
        </div>
      </div>
      <div
        className={`roomActions ${isAdmin?.isAdmin ? "admin" : "notAdmin"} ${
          hasFocus ? "focused" : ""
        }`}
      >
        <h2 className="heading">Room Actions</h2>
        <Formik
          initialValues={{
            userName: "",
          }}
          onSubmit={async () => {
            if (!isAddUserInputValueValid) {
              return;
            }

            addUserMutation({
              variables: {
                usernameTag: addUserInputValue,
                // @ts-ignore not sure why but currentChat isn't a number
                roomId: parseInt(currentChat, 10),
              },
              refetchQueries: [
                {
                  query: LOAD_ROOM_QUERY,
                  variables: {
                    // @ts-ignore not sure why but currentChat isn't a number
                    roomId: parseInt(currentChat, 10),
                  },
                },
              ],
            });
          }}
        >
          {({ handleSubmit, errors, touched, values }) => (
            <Form onSubmit={handleSubmit}>
              {isAdmin?.isAdmin ? (
                <>
                  <div className="addUserWrapper">
                    <Field
                      name="userNameOrEmail"
                      value={addUserInputValue}
                      type="text"
                      id="userNameOrEmail"
                      className="addUserInput inputText"
                      autoComplete="off"
                      placeholder="Enter a Username#0000"
                      onChange={handleAddUserInputChange}
                      onFocus={() => setFocus(true)}
                      onBlur={() => setFocus(false)}
                    />
                    {addUserInputValue !== "" && (
                      <div className="addUserInputHint inputText">
                        {getAddUserInput(addUserInputValue)}
                      </div>
                    )}
                  </div>
                  {addUserMutationData?.addUserToRoom?.statusCode !== 200 && (
                    <div className="addUserStatus">
                      {addUserMutationData?.addUserToRoom?.message}
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`addUserButton ${
                      isAddUserInputValueValid ? "valid" : ""
                    }`}
                  >
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
