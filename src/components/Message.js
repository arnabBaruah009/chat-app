import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import styles from "../styles/message.module.css";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
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
