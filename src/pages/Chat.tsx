import "../sass/pages/chat.sass";
import { AllChatRooms } from "../components/Chat/AllChatRooms";
import { ChatRoom } from "../components/Chat/ChatRoom";
import { Participants } from "../components/Chat/Participants";
import useStore from "../zustand/store";
import { Redirect } from "react-router";
import { Header } from "../components/Chat/Header";
import { CreateRoom } from "../components/Chat/CreateRoom";

export const Chat = () => {
  const loggedIn = useStore((state) => state.loggedIn);
  const currentChat = useStore((state) => state.currentChat);
  const isCreateRoomVisible = useStore((state) => state.isCreateRoomVisible);

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="application">
      <Header />
      <div className="chat">
        <AllChatRooms />
        {currentChat === 0 ? <div></div> : <ChatRoom />}
        {currentChat === 0 ? <div></div> : <Participants />}
        {isCreateRoomVisible && <CreateRoom />}
      </div>
    </div>
  );
};
