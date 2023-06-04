import { signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
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
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "users", data.user.uid), {
      lastText: text,
    });

    setText("");
  };

  return (
    <>
      {Object.keys(user).length != 0 ? (
        <div className={styles.rightContainer}>
          <div className={styles.header}>
            <img src={user.photoURL} alt="profile" />
            <p className={styles.userName}>{user.displayName}</p>
            <button onClick={() => signOut(auth)} className={styles.logout}>
              Log out
              <div class={styles.arrowWrapper}>
                <div class={styles.arrow}></div>
              </div>
            </button>
          </div>
          <div className={styles.messages}>
            <ul>
              {messages.map((message, index) => {
                return (
                  <li
                    className={
                      message.senderID === currentUser.uid
                        ? `${styles.owner}`
                        : `${styles.receiver}`
                    }
                  >
                    <Message message={message} key={`m+${index}`} />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.inputDiv}>
            <textarea
              value={text}
              placeholder="Type something..."
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSend}>
              <p>Send</p>
              <svg
                strokeWidth="4"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
          </div>
          <div class="Message"></div>
        </div>
      ) : (
        <div className={styles.start}>
          <span>Start a conversation</span>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
