import useStore from "../../zustand/store";
import { Participants } from "./Participants";
import { RoomInfo } from "./RoomInfo";

export const ChatSide = () => {
  const viewRoomInfo = useStore((state) => state.viewRoomInfo);

  if (viewRoomInfo) {
    return <RoomInfo />;
  }

  return <Participants />;
};
