import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import useStore from "../../zustand/store";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

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

        <div>
          <input type="text" />
          <FontAwesomeIcon cursor="pointer" icon={faSearch} />

          <FontAwesomeIcon
            cursor="pointer"
            onClick={onCreateRoomClick}
            icon={faPlus}
          />
        </div>
      </header>
      {rooms?.map((room: roomInterface) => (
        <div
          className="roomPreview"
          // * use this key (or just the room.id to query a specific room)
          key={room.id}
          style={{ backgroundColor: "#ccc", marginBottom: "20px" }}
          onClick={onChatClick(room.id)}
        >
          <img
            src={room.image ? `http://${room.image}` : ""}
            width="100px"
            alt=""
          />
          <h1>{room.name}</h1>
        </div>
      ))}
    </div>
  );
};
