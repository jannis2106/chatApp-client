// acces currentChat Zustand state here
// load room Info depending on the currentChat
// maybe don't render as a new route, onliny instead of ChatRoom aber immer noch mit AllChatRooms an der Seite
// wenn dann aber der Raum gewechselt wird oder der Raum erneut angeklickt wird, wird wieder der Chat gezeigt

// Participants wird aber weiterhin angezegit i guess mal sehen

import React from "react";
import useStore from "../../zustand/store";
import { gql, useQuery } from "@apollo/client";

const LOAD_ROOM_QUERY = gql`
  query loadRoom($roomId: Float!) {
    loadRoom(roomId: $roomId) {
      id
      room {
        name
        created
        image
      }
    }
  }
`;

export const RoomInfo: React.FC = () => {
  const setViewRoomInfo = useStore((state) => state.setViewRoomInfo);
  const currentChat = useStore((state) => state.currentChat);

  let { data: room, loading } = useQuery(LOAD_ROOM_QUERY, {
    // @ts-ignore idk why but currentChat isn't a number
    variables: { roomId: parseInt(currentChat, 10) },
  });

  const closeRoomInfo = () => {
    setViewRoomInfo(false);
  };

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const created = new Date(room?.loadRoom.room.created);

  // @ts-ignore
  const roomAge = Math.round(Math.abs((created - now) / oneDay));

  const roomAgeDetailed =
    roomAge >= 365
      ? {
          years: Math.round(roomAge / 365),
          days: (roomAge % 365) % 7,
        }
      : {
          years: null,
          days: roomAge,
        };

  // * LOAD_ROOM_QUERY is loading * //
  if (loading) {
    return (
      <div className="roomInfo">
        <p>loading ...</p>
      </div>
    );
  }

  return (
    <div className="roomInfo">
      <header>
        <button onClick={closeRoomInfo} style={{ cursor: "pointer" }}>
          X
        </button>
      </header>
      <h1>{room.loadRoom.room.name}</h1>
      <img src={room.loadRoom.room.image ? room.loadRoom.image : ""} alt="" />

      <div>
        <h3>Room age:</h3>
        {roomAgeDetailed.years && <p>Years: {roomAgeDetailed.years}</p>}
        <p>Days: {roomAgeDetailed.days}</p>
      </div>
    </div>
  );
};
