import { gql, useMutation, useQuery } from "@apollo/client";
import React, {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import useStore from "../../zustand/store";
import { ProfileImage } from "../ProfileImage";
import client from "../../apollo/client";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faTrash,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { LOAD_ROOM_QUERY } from "../../apollo/graphql/Mutations";

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($roomId: Float!, $message: String!) {
    sendMessage(roomId: $roomId, message: $message)
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription messageSubscription($roomId: Float!) {
    messageSubscription(roomId: $roomId) {
      id
      user {
        id
        image
        username
        usernameTag
      }
      date
      messageContent
    }
  }
`;

interface MessageInterface {
  user: {
    usernameTag: string;
    username: string;
    image?: string;
  };
  messageContent: string;
  date: Date;
  id: number;
}

const LOAD_ROOM_MESSAGES_QUERY = gql`
  query loadRoomMessages($roomId: Float!) {
    loadRoom(roomId: $roomId) {
      messages {
        id
        user {
          id
          image
          username
          usernameTag
        }
        date
        messageContent
        id
      }
    }
  }
`;

const ME_QUERY = gql`
  query userNameTag {
    me {
      id
      usernameTag
    }
  }
`;

const DELETE_MESSAGE_MUTATION = gql`
  mutation deleteMessage($messageId: Float!) {
    deleteMessage(messageId: $messageId)
  }
`;

export const ChatRoom = () => {
  // * Zustand states * //
  const currentChat = useStore((state) => state.currentChat);
  const setParticipants = useStore((state) => state.setParticipants);
  const setAdmins = useStore((state) => state.setAdmins);

  // * Server Data * //
  let { data: room, loading } = useQuery(LOAD_ROOM_QUERY, {
    // @ts-ignore not sure why but currentChat isn't a number
    variables: { roomId: parseInt(currentChat, 10) },
  });
  const { data: userData } = useQuery(ME_QUERY);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE_MUTATION);
  const [deleteMessageMutation] = useMutation(DELETE_MESSAGE_MUTATION);

  let roomData = room?.loadRoom;

  // * set states for Participants component * //
  useEffect(() => {
    setParticipants(roomData?.participants);
    setAdmins(roomData?.room.admins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // * message subscription * //
  const { data: messagesData, subscribeToMore } = useQuery(
    LOAD_ROOM_MESSAGES_QUERY,
    {
      // @ts-ignore
      variables: { roomId: parseInt(currentChat, 10) },
    }
  );

  const chatBoxWrapper = useRef<HTMLDivElement>(null);
  const today = new Date();

  // * returns date in MM/DD/YYYY format * //
  const returnDate = (date: Date) => {
    let todayDate = today.toString().split("T")[0].split("-");
    if (!date) return `${todayDate[1]}/${todayDate[2]}/${todayDate[0]}`;

    let arr = date.toString().split("T")[0].split("-");
    return `${arr[1]}/${arr[2]}/${arr[0]}`;
  };

  // * called once, subsribes for messages * //
  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      // @ts-ignore
      variables: { roomId: parseInt(currentChat, 10) },
      // @ts-ignore
      updateQuery: (prev: any, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        return Object.assign({}, prev, {
          loadRoom: {
            messages: [
              ...prev?.loadRoom?.messages,
              subscriptionData?.data?.messageSubscription,
            ],
          },
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // * handle send message button click * //
  let input: HTMLInputElement | null;
  const sendMessageOnClickOrSumbit = (
    e: MouseEvent<SVGSVGElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!(input!.value === "")) {
      sendMessageMutation({
        variables: {
          // @ts-ignore not sure why but currentChat isn't a number
          roomId: parseInt(currentChat, 10),
          message: input!.value,
        },
      });
      input!.value = "";
    }

    if (chatBoxWrapper?.current) {
      chatBoxWrapper?.current.scroll({
        top: chatBoxWrapper?.current.scrollHeight + 100,
        behavior: "smooth",
      });
    }
  };

  // * delete message * //
  const deleteMessage = (messageId: number) => {
    return (e: React.MouseEvent) => {
      deleteMessageMutation({
        variables: {
          // @ts-ignore
          messageId: parseInt(messageId),
        },
      });
      let oldMessages: MessageInterface[] = Array.from(
        messagesData?.loadRoom?.messages
      );
      const index = oldMessages.findIndex(
        (x: { id: number }) => x.id === messageId
      );
      const newMessages = oldMessages.splice(index, 1);
      client.writeQuery({
        query: gql`
          query loadRoomMessages($roomId: Float!) {
            loadRoom(roomId: $roomId) {
              messages {
                id
                user {
                  id
                  image
                  username
                  usernameTag
                }
                date
                messageContent
                id
              }
            }
          }
        `,
        data: {
          loadRoom: {
            messages: newMessages,
          },
        },
        // @ts-ignore
        variables: { roomId: parseInt(currentChat, 10) },
      });
      e.preventDefault();
    };
  };

  // * if scrolled near bottom scroll down on new message * //
  useEffect(() => {
    if (chatBoxWrapper?.current) {
      if (chatBoxWrapper?.current?.scrollTop >= -100) {
        chatBoxWrapper?.current.scroll({
          top: chatBoxWrapper?.current.scrollHeight + 100,
          behavior: "smooth",
        });
      }
    }
  }, [messagesData?.loadRoom?.messages]);

  const [reloading, setReloading] = useState(false);

  // * reload chat room and refetch messages * //
  const reloadRoom = async () => {
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 1000);
    await client.refetchQueries({
      include: [LOAD_ROOM_QUERY],
    });
  };

  // * LOAD_ROOM_QUERY is loading * //
  if (loading) {
    return (
      <div>
        <p>loading ...</p>
      </div>
    );
  }

  return (
    <div className="chatRoom">
      <header>
        <div className="roomInfos">
          <img
            src={roomData?.room.image ? `http://${roomData?.room.image}` : ""}
            alt=""
          />
          <h1>{roomData?.room.name}</h1>
        </div>
        <div className={`reloadChat ${reloading ? "reloading" : ""}`}>
          <FontAwesomeIcon
            cursor="pointer"
            onClick={reloadRoom}
            icon={faRedoAlt}
            className={reloading ? "reloading" : ""}
          />
        </div>
      </header>
      <div className="chatBoxWrapper" ref={chatBoxWrapper}>
        <div className="chatBox">
          {messagesData?.loadRoom?.messages.map((message: MessageInterface) => {
            return (
              <div key={message?.id} className="message">
                <ProfileImage
                  image={message?.user?.image}
                  username={message?.user?.username}
                />
                <div className="messageRight">
                  <p className="top">
                    <span className="username">
                      {message?.user?.usernameTag}{" "}
                    </span>
                    <span className="date">{returnDate(message?.date)}</span>
                  </p>
                  <p className="messageContent">{message?.messageContent}</p>
                </div>
                {message?.user?.usernameTag === userData?.me?.usernameTag && (
                  <div className="deleteMessage">
                    <FontAwesomeIcon
                      onClick={deleteMessage(message?.id)}
                      icon={faTrash}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessageOnClickOrSumbit(e);
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
          type="text"
          placeholder="Write a message..."
        />{" "}
        <FontAwesomeIcon
          cursor="pointer"
          onClick={sendMessageOnClickOrSumbit}
          icon={faPaperPlane}
        />
      </form>
    </div>
  );
};
