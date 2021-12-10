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
    <>
      {image ? (
        <img
          width="35px"
          src={`http://${image}`}
          alt=""
          className="profileImage"
        />
      ) : (
        <UserImage username={username} />
      )}
    </>
  );
};

interface UserImageProps {
  username: string;
}

const UserImage: React.FC<UserImageProps> = ({ username }) => {
  if (!username) {
    return <GrayProfile className="profileImage" />;
  }

  switch (username.charAt(0)) {
    case "a" || "b" || "c" || "d" || "e" || "f":
      return <BlueProfile className="profileImage" />;

    case "g" || "h" || "i" || "j" || "k" || "l":
      return <GreenProfile className="profileImage" />;

    case "m" || "n" || "o" || "p" || "q" || "r" || "s":
      return <PinkProfile className="profileImage" />;

    case "t" || "u" || "v" || "w" || "x" || "y" || "z":
      return <GrayProfile className="profileImage" />;

    default:
      return <GreenProfile className="profileImage" />;
  }
};
