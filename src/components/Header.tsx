import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { ProfileImage } from "./ProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Logo } from "../sass/images/logo.svg";
import useStore from "../zustand/store";
import { Loading } from "./Loading";

const PROFILE_PICTURE_QUERY = gql`
  query profileImage {
    me {
      image
    }
  }
`;

interface HeaderProps {
  route: String;
}

export const Header: React.FC<HeaderProps> = ({ route }) => {
  const { data: profileImageData } = useQuery(PROFILE_PICTURE_QUERY);
  const loggedIn = useStore((state) => state.loggedIn);

  if (loggedIn === false) {
    return <Loading />;
  }

  return (
    <header className="applicationHeader">
      <div className="leftHeader">
        <Link to="/">
          <Logo className="logo" />
        </Link>
        <h1>{route}</h1>
      </div>

      <div className="rightHeader">
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon icon={faSearch} className="searchIcon" />

        <Link to="/profile">
          <ProfileImage
            image={profileImageData?.me.image}
            username={profileImageData?.me.username}
          />
        </Link>
      </div>
    </header>
  );
};
