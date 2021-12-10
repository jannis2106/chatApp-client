import { useQuery } from "@apollo/client";
import { Redirect } from "react-router";
import useStore from "../../zustand/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as GrayProfile } from "../../sass/images/profile_gray.svg";
import { Loading } from "../Loading";
import { LOAD_ALL_ROOMS_QUERY } from "../../apollo/graphql/Queries";

interface roomInterface {
  id: number;
  name: string;
  image?: string;
}

export const AllChatRooms = () => {
  const { data, loading } = useQuery(LOAD_ALL_ROOMS_QUERY);

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

  const onCreateRoomClick = () => {
    setIsCreateRoomVisible(true);
  };

  if (data?.temp === null) {
    return <Redirect to="/login" />;
  }

  let rooms = data?.loadAllRooms;

  if (loading) return <Loading />;

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
