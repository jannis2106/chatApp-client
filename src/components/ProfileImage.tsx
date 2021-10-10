import React from "react";
import { ReactComponent as BlueProfile } from "../sass/images/profile_blue.svg";
import { ReactComponent as GreenProfile } from "../sass/images/profile_green.svg";
import { ReactComponent as PinkProfile } from "../sass/images/profile_pink.svg";
import { ReactComponent as GrayProfile } from "../sass/images/profile_gray.svg";

interface ProfileImageProps {
  image: string | undefined;
  username: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  image,
  username,
}) => {
  return (
    <div className="profileImg">
      {image ? (
        <img
          width="35px"
          src={
            `http://${image}`
            // : `https://avatars.dicebear.com/api/bottts/${userName}.svg` // change dicebear avatar to logo with dark background , maybe random color like discord did
          }
          alt=""
          className="profileImage"
        />
      ) : (
        <UserImage username={username} />
      )}
    </div>
  );
};

// * NEXT: click on any profile picture || username to view the user profile detail and (list all common rooms // gibt keine privat chats) * //

interface UserImageProps {
  username: string;
}

const UserImage: React.FC<UserImageProps> = ({ username }) => {
  // const firstCharakter = username[0];

  if (!username) {
    return <GrayProfile />;
  }

  switch (username.charAt(0)) {
    case "a" || "b" || "c" || "d" || "e" || "f":
      return <BlueProfile />;

    case "g" || "h" || "i" || "j" || "k" || "l":
      return <GreenProfile />;

    case "m" || "n" || "o" || "p" || "q" || "r" || "s":
      return <PinkProfile />;

    case "t" || "u" || "v" || "w" || "x" || "y" || "z":
      return <GrayProfile />;

    default:
      return <GreenProfile />;
  }
};
