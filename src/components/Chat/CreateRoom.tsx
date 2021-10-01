import { gql, useMutation } from "@apollo/client";
import { Field, Formik } from "formik";
import { useEffect } from "react";
import useStore from "../../zustand/store";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CREATE_ROOM_MUTATION = gql`
  mutation createRoom($name: String!) {
    createRoom(name: $name)
  }
`;

export const CreateRoom: React.FC = () => {
  const [createRoomMutation, { data }] = useMutation(CREATE_ROOM_MUTATION);

  const setIsCreateRoomVisible = useStore(
    (state) => state.setIsCreateRoomVisible
  );

  const setForceRefreshValue = useStore((state) => state.setForceRefreshValue);

  useEffect(() => {
    if (data && data.createRoom) {
      setIsCreateRoomVisible(false); // close window
      setForceRefreshValue(); // force refresh of AllChatRooms to display the new Room
    }
    if (data && data.createRoom === false) {
      setIsCreateRoomVisible(true); // keep window visible
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const closeWindow = () => {
    setIsCreateRoomVisible(false);
  };

  return (
    <div
      style={{
        zIndex: 100,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "50vh",
        width: "50vw",
        border: "3px black solid",
        boxShadow: "5 5 5 5 black",
        background: "white",
      }}
    >
      <h1>Create Chat Room</h1>

      <Formik
        initialValues={{
          roomName: "",
        }}
        onSubmit={(values) => {
          createRoomMutation({
            variables: {
              name: values.roomName,
            },
          });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form action="submit" onSubmit={handleSubmit}>
            <label htmlFor="roomName">Room Name</label>
            <Field name="roomName" type="text" id="roomName"></Field>
            <button type="submit" disabled={isSubmitting}>
              Create Room
            </button>
          </form>
        )}
      </Formik>

      <FontAwesomeIcon onClick={closeWindow} icon={faTimes} />
    </div>
  );
};
