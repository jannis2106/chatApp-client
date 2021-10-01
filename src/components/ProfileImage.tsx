import React from "react";

interface ProfileImageProps {
  image: String | undefined;
  size?: Number;
  userName: String;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  image,
  size,
  userName,
}) => {
  return (
    <img
      //   width={size ? `${size}px` : ""}
      width="35px"
      src={
        image
          ? `http://${image}`
          : `https://avatars.dicebear.com/api/bottts/${userName}.svg`
      }
      alt=""
      className="profileImage"
    />
  );
};

// * NEXT: click on any profile picture || username to view the user profile detail and (list all common rooms // gibt keine privat chats) * //
