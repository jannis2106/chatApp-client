import "../sass/pages/chat.sass";
import { AllChatRooms } from "../components/Chat/AllChatRooms";
import { ChatRoom } from "../components/Chat/ChatRoom";
import { Participants } from "../components/Chat/Participants";
import useStore from "../zustand/store";
import { Redirect } from "react-router";
import { Header } from "../components/Header";
import { CreateRoom } from "../components/Chat/CreateRoom";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../components/Loading";

export const Chat = () => {
  const currentChat = useStore((state) => state.currentChat);
  const isCreateRoomVisible = useStore((state) => state.isCreateRoomVisible);
  const loggedIn = useStore((state) => state.loggedIn);

  if (loggedIn === false) {
    return <Redirect to="/login" />;
  }

  if (loggedIn === undefined) {
    return <Loading />;
  }

  const pageTransition = {
    in: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
      },
    },
    out: {
      opacity: 0,
      x: "-100%",
    },
  };

  return (
    <div className="application">
      <Header route={"Messaging"} />
      <motion.div
        className="chat"
        variants={pageTransition}
        initial="out"
        animate="in"
        exit="out"
      >
        <AllChatRooms />
        {currentChat === 0 ? <div></div> : <ChatRoom />}
        {currentChat === 0 ? <div></div> : <Participants />}

        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => console.log("exit")}
        >
          {isCreateRoomVisible && <CreateRoom />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
