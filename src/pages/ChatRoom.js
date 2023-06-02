import { useState } from "react";
import { LeftSidebar, RightSidebar } from "../components";

const ChatRoom = () => {
  const [user, setUser] = useState({});

  const handleClick = (data) => {
    setUser(data);
  };

  return (
    <>
      <LeftSidebar user={user} handleClick={handleClick} />
      <RightSidebar user={user} />
    </>
  );
};

export default ChatRoom;
