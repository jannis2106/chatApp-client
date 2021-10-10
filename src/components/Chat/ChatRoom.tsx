import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, MouseEvent, useEffect } from "react";
import useStore from "../../zustand/store";
import { ProfileImage } from "../ProfileImage";
import client from "../../apollo/client";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";

const LOAD_ROOM_QUERY = gql`
  query loadRoom($roomId: Float!) {
    loadRoom(roomId: $roomId) {
      id
      room {
        name
        admins {
          id
          username
          image
          aboutMe
        }
        image
      }
      participants {
        id
        username
        image
        aboutMe
      }
      messages {
        user {
          usernameTag
          image
        }
        messageContent
        date
        id
      }
    }
  }
`;

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
        image
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
    // @ts-ignore idk why but currentChat isn't a number
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

  // * subscription * //
  const { data: messagesData, subscribeToMore } = useQuery(
    LOAD_ROOM_MESSAGES_QUERY,
    {
      // @ts-ignore
      variables: { roomId: parseInt(currentChat, 10) },
    }
  );

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
          // @ts-ignore idk why but currentChat isn't a number
          roomId: parseInt(currentChat, 10),
          message: input!.value,
        },
      });
      input!.value = "";
    }
  };

  const deleteMessage = (messageId: number) => {
    return (e: React.MouseEvent) => {
      console.log(typeof messageId);
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
        <h1>{roomData?.room.name}</h1>
        <img
          src={roomData?.room.image ? `http://${roomData?.room.image}` : ""}
          alt=""
        />
      </header>
      <div>
        {messagesData?.loadRoom?.messages.map((message: MessageInterface) => {
          return (
            <div key={message?.id}>
              <ProfileImage
                image={message?.user?.image}
                username={message?.user?.username}
              />
              <p>{message?.user?.usernameTag}</p>
              <p>{message?.messageContent}</p>
              <span>{message?.date}</span>
              {message?.user?.usernameTag === userData?.me?.usernameTag && (
                <FontAwesomeIcon
                  onClick={deleteMessage(message?.id)}
                  icon={faTrash}
                />
              )}
            </div>
          );
        })}
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
