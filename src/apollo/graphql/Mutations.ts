import { gql } from "@apollo/client";

export const LOAD_ROOM_QUERY = gql`
  query loadRoom($roomId: Float!) {
    loadRoom(roomId: $roomId) {
      id
      room {
        id
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
          id
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
