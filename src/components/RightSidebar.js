import { signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc
} from "firebase/firestore";

import styles from "../styles/rightsidebar.module.css";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Message } from "./";

const RightSidebar = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatID), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatID]);

  const handleSend = async () => {
    if (text === "") {
      return;
    }

    await updateDoc(doc(db, "chats", data.chatID), {
      messages: arrayUnion({
        text,
        senderID: currentUser.uid,
        date: Timestamp.now()
      })
    });

    await updateDoc(doc(db, "users", data.user.uid), {
      lastText: text
    });

    setText("");
  };

  return (
    <div className={styles.rightContainer}>
      <div className={styles.header}>
        <img src={user.photoURL} alt="profile" />
        <p className={styles.userName}>{user.displayName}</p>
        <button onClick={() => signOut(auth)} className={styles.logout}>
          Logout
        </button>
      </div>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          return <Message message={message} key={`m+${index}`} />;
        })}
      </div>
      <div className={styles.inputDiv}>
        <input
          value={text}
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default RightSidebar;
