import { gql, useMutation } from "@apollo/client";
import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import useStore from "../../zustand/store";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { LOAD_ALL_ROOMS_QUERY } from "../../apollo/graphql/Queries";

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

  useEffect(() => {
    if (data && data.createRoom) {
      setIsCreateRoomVisible(false); // close window
    }
    if (data && data.createRoom === false) {
      setIsCreateRoomVisible(true); // keep window visible
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const closeWindow = () => {
    setIsCreateRoomVisible(false);
  };

  const [isInputValid, setIsInputValid] = useState(false);
  const [createRoomValue, setCreateRoomValue] = useState("");

  const validateInput = (e: any) => {
    setCreateRoomValue(e.target.value);

    console.log(e);
    console.log(e.target.value);

    if (e.target.value !== "") {
      setIsInputValid(true);
    } else {
      setIsInputValid(false);
    }
  };

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
    <div className="createRoomWrapper">
      <motion.div
        className="createRoomDiv"
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragPropagation={true}
        dragElastic={0.7}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1>Create Chat Room</h1>

        <Formik
          initialValues={{
            roomName: "",
          }}
          onSubmit={async () => {
            if (!isInputValid) {
              return;
            }
            createRoomMutation({
              variables: {
                name: createRoomValue,
              },
              refetchQueries: [
                {
                  query: LOAD_ALL_ROOMS_QUERY,
                },
              ],
            });
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form action="submit" onSubmit={handleSubmit}>
              <label htmlFor="roomName">Room Name</label> <br />
              <div className="roomNameWrapper">
                <Field
                  name="roomName"
                  value={createRoomValue}
                  type="text"
                  id="roomName"
                  className="roomNameInput"
                  autocomplete="off"
                  onChange={validateInput}
                />
                <br />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`createRoomButon ${isInputValid ? "valid" : ""}`}
              >
                Create Room
              </button>
            </form>
          )}
        </Formik>

        <div className="closeWindow" onClick={closeWindow}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </motion.div>
    </div>
  );
};
