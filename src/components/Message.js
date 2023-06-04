import { useRef, useEffect } from "react";

import styles from "../styles/message.module.css";

const Message = ({ message }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={styles.message}
    >
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
