import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import useStore from "../../zustand/store";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as GrayProfile } from "../../sass/images/profile_gray.svg";

const LOAD_ALL_ROOMS_QUERY = gql`
  query loadAllRooms {
    loadAllRooms {
      id
      name
      image
    }
  }
`;

interface roomInterface {
  id: number;
  name: string;
  image?: string;
}

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export const AllChatRooms = () => {
  const { data } = useQuery(LOAD_ALL_ROOMS_QUERY);

  // * switch chat rooms * //
  const changeCurrentChat = useStore((state) => state.changeCurrentChat);
  const onChatClick = (chatId: number) => {
    return () => {
      changeCurrentChat(chatId);
    };
  };

  const setIsCreateRoomVisible = useStore(
    (state) => state.setIsCreateRoomVisible
  );
  const isCreateRoomVisible = useStore((state) => state.isCreateRoomVisible);

  const forceRefreshValue = useStore((state) => state.forceRefreshValue);

  const forceUpdate = useForceUpdate();

  const onCreateRoomClick = () => {
    setIsCreateRoomVisible(true);
  };

  useEffect(() => {
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceRefreshValue]);

  if (data?.temp === null) {
    return <Redirect to="/login" />;
  }

  let rooms = data?.loadAllRooms;

  return (
    <div className="roomList">
      <header>
        <h1>Chats</h1>

        <div
          className={`createRoom ${isCreateRoomVisible ? "active" : ""}`}
          onClick={onCreateRoomClick}
        >
          <FontAwesomeIcon cursor="pointer" icon={faPlus} />
        </div>
      </header>
      <div className="roomsList">
        {rooms?.map((room: roomInterface) => (
          <div
            className="roomPreview"
            key={room.id}
            onClick={onChatClick(room.id)}
          >
            {room.image ? (
              <img
                src={`http://${room.image}`}
                width="100px"
                alt=""
                className="roomImage"
              />
            ) : (
              <GrayProfile className="roomImage" />
            )}
            <h1>{room.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};
