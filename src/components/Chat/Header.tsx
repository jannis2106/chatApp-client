import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { ProfileImage } from "../ProfileImage";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faSearch } from "@fortawesome/free-solid-svg-icons";

const PROFILE_PICTURE_QUERY = gql`
  query profileImage {
    me {
      image
    }
  }
`;

export const Header = () => {
  const { data: profileImageData } = useQuery(PROFILE_PICTURE_QUERY);
  return (
    <header className="application-header" style={{ height: "5vh" }}>
      <div>
        <FontAwesomeIcon icon={faCommentDots} />
        <h1>Messaging</h1>
      </div>

      <div>
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon cursor="pointer" icon={faSearch} />

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
