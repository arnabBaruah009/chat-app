import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import styles from "../styles/message.module.css";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div
      className={
        message.senderID === currentUser.uid
          ? `${styles.owner} ${styles.message}`
          : `${styles.receiver} ${styles.message}`
      }
    >
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
